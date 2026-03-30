/**
 * Scrape all property images from a Zillow listing page using Puppeteer with stealth.
 * Uses puppeteer-extra-plugin-stealth to bypass PerimeterX bot detection.
 *
 * Usage: node scripts/scrape-zillow-images.cjs <zillow_detail_url>
 * Output: JSON array of hi-res image URLs to stdout (debug goes to stderr)
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function scrapeImages(url) {
    let browser;
    try {
        if (!fs.existsSync(CHROME_PATH)) {
            console.error('Chrome not found at:', CHROME_PATH);
            return [];
        }

        console.error('Launching Chrome (stealth mode)...');
        browser = await puppeteer.launch({
            executablePath: CHROME_PATH,
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--window-size=1920,1080',
            ],
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        console.error('Navigating to:', url);
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 45000,
        });

        // Wait for page to fully render
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Check if blocked
        const content = await page.content();
        const hasCaptcha = content.includes('px-captcha');
        console.error('Page length:', content.length, 'Has captcha:', hasCaptcha);

        if (hasCaptcha) {
            console.error('PerimeterX detected. Waiting for auto-resolution...');
            await new Promise(resolve => setTimeout(resolve, 10000));
            const content2 = await page.content();
            console.error('After wait - length:', content2.length, 'captcha:', content2.includes('px-captcha'));
        }

        // Extract images
        const result = await page.evaluate(() => {
            const html = document.documentElement.innerHTML;
            const regex = /https?:\/\/photos\.zillowstatic\.com\/fp\/([a-f0-9]+)-([^"'>\s\\]+)/gi;
            const matches = {};
            let m;

            while ((m = regex.exec(html)) !== null) {
                if (!matches[m[1]]) matches[m[1]] = {};
                matches[m[1]][m[2]] = m[0];
            }

            // Also check img src and srcset
            document.querySelectorAll('img').forEach(img => {
                const src = img.src || '';
                const srcset = img.srcset || '';
                [src, ...srcset.split(',').map(s => s.trim().split(' ')[0])].forEach(u => {
                    const im = u.match(/https?:\/\/photos\.zillowstatic\.com\/fp\/([a-f0-9]+)-(.+)/i);
                    if (im) {
                        if (!matches[im[1]]) matches[im[1]] = {};
                        matches[im[1]][im[2]] = im[0];
                    }
                });
            });

            // Filter for property photos (cc_ft_ variants) and get hi-res
            const knownBad = ['4d4b096f2a11abd8258e1ff6a28939f0'];
            const prefs = ['cc_ft_1536.jpg','cc_ft_1344.jpg','cc_ft_1152.jpg','cc_ft_960.jpg','uncropped_scaled_within_1344_1008.jpg','p_d.jpg'];
            const images = [];

            for (const [hash, suffixes] of Object.entries(matches)) {
                if (knownBad.includes(hash)) continue;
                if (!Object.keys(suffixes).some(s => s.startsWith('cc_ft_'))) continue;

                let picked = null;
                for (const p of prefs) {
                    if (suffixes[p]) { picked = suffixes[p]; break; }
                }
                if (!picked) {
                    for (const [s, u] of Object.entries(suffixes)) {
                        if (s.startsWith('cc_ft_') && s.endsWith('.jpg')) { picked = u; break; }
                    }
                }
                if (picked) images.push(picked);
            }

            return { total: Object.keys(matches).length, property: images.length, images };
        });

        console.error(`Result: ${result.total} hashes total, ${result.property} property photos`);
        await browser.close();
        return result.images;
    } catch (error) {
        console.error('Error:', error.message);
        if (browser) await browser.close();
        return [];
    }
}

const url = process.argv[2];
if (!url) {
    console.error('Usage: node scripts/scrape-zillow-images.cjs <zillow_url>');
    process.exit(1);
}

scrapeImages(url)
    .then(images => console.log(JSON.stringify(images)))
    .catch(() => console.log(JSON.stringify([])));
