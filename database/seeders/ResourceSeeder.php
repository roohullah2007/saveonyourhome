<?php

namespace Database\Seeders;

use App\Models\Resource;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ResourceSeeder extends Seeder
{
    public function run(): void
    {
        $sellerArticles = [
            [
                'title' => 'Tips for Hosting a Successful Open House',
                'excerpt' => 'Learn how to prepare your home for an open house that attracts serious buyers and generates competitive offers.',
                'image' => '/images/home-img.webp',
            ],
            [
                'title' => 'Strategies for Setting The Sales Price On Your Home',
                'excerpt' => 'Discover proven pricing strategies that help you sell your home faster while maximizing your return.',
                'image' => '/images/sell-image.webp',
            ],
            [
                'title' => 'When to Hire an Attorney for Your FSBO Home Sale',
                'excerpt' => 'Understanding when legal expertise is essential in your FSBO journey to protect your interests.',
                'image' => '/images/keys.webp',
            ],
            [
                'title' => 'Expert Tips for a Seamless FSBO Experience',
                'excerpt' => 'From listing to closing, get expert advice to make your For Sale By Owner experience smooth and profitable.',
                'image' => '/images/seller-resources.webp',
            ],
            [
                'title' => 'Maximizing Safety When Selling Your Home On Your Own',
                'excerpt' => 'Essential safety tips for showing your home and meeting potential buyers during the FSBO process.',
                'image' => '/images/sell-img-2.webp',
            ],
            [
                'title' => 'DIY Home Photography and Staging: Tips for Cost-Conscious Sellers',
                'excerpt' => 'Take professional-quality photos and stage your home beautifully without breaking the bank.',
                'image' => '/images/home-img-2.webp',
            ],
            [
                'title' => 'Selling Your Home: FSBO vs. Real Estate Agent – How to Decide',
                'excerpt' => 'A comprehensive comparison to help you choose the best approach for selling your property.',
                'image' => '/images/home-img.webp',
            ],
            [
                'title' => 'Avoid the Pitfalls of Selling By Owner',
                'excerpt' => 'Common mistakes FSBO sellers make and how to avoid them for a successful home sale.',
                'image' => '/images/sell-image.webp',
            ],
        ];

        $buyerArticles = [
            [
                'title' => 'Secure Your Dream Home: The Power of a Pre-Approval in Home Buying',
                'excerpt' => 'Why getting pre-approved is the most important first step in your home buying journey.',
                'image' => '/images/buyer-1.webp',
            ],
            [
                'title' => 'Transforming Real Estate: The SaveOnYourHome.com Difference',
                'excerpt' => 'How SaveOnYourHome.com is revolutionizing the way people buy and sell homes.',
                'image' => '/images/keys.webp',
            ],
            [
                'title' => 'Market Updates: FSBO Insights and Opportunities',
                'excerpt' => 'Stay informed with the latest FSBO market trends, data, and opportunities for buyers.',
                'image' => '/images/buyer-2.webp',
            ],
            [
                'title' => 'Why Buyers Love FSBO Homes: A Deep Dive',
                'excerpt' => 'Discover the advantages of buying directly from homeowners and how it can save you money.',
                'image' => '/images/buyer-1.webp',
            ],
        ];

        $blogArticles = [
            [
                'title' => '5 Low-Cost Upgrades That Add the Most Value Before You Sell',
                'excerpt' => 'You do not have to renovate the whole house. These five small projects consistently deliver the biggest return on resale value.',
                'content' => <<<'HTML'
<p>When you are preparing a home for the market, the instinct is often to spend big on a kitchen or bathroom remodel. The reality is that small, targeted improvements almost always deliver a better return — especially for FSBO sellers who are already saving thousands on commission.</p>
<h2>1. Repaint in neutral, modern tones</h2>
<p>A fresh coat of paint in soft greiges or warm whites makes every photo and every walk-through feel cleaner and larger. Budget: roughly $500–$1,500 per floor depending on square footage.</p>
<h2>2. Swap dated light fixtures</h2>
<p>Flush-mount "boob" lights and brass chandeliers date a home instantly. Replacing 4–6 fixtures with simple modern pieces costs under $800 and makes rooms feel bigger in evening photos.</p>
<h2>3. Deep-clean and refresh grout</h2>
<p>A professional deep clean plus fresh grout in bathrooms and kitchens reads as "well-maintained" to buyers. Most homeowners skip this and it shows.</p>
<h2>4. Curb appeal under $300</h2>
<p>Power-wash the driveway, edge the lawn, add two matching planters by the front door, and replace the house numbers. That is the entire playbook.</p>
<h2>5. Declutter — ruthlessly</h2>
<p>The single highest-ROI thing you can do before photos is remove one-third of everything. Closets should be 50% full. Countertops should have no more than three objects. Empty space photographs as "bigger."</p>
<p><strong>Bottom line:</strong> spend under $3,000 total, not $30,000, and let the buyer imagine their own finishes.</p>
HTML,
                'image' => '/images/home-img-2.webp',
            ],
            [
                'title' => 'FSBO in 2026: What Has Changed for For Sale By Owner Sellers',
                'excerpt' => 'Commission rules, buyer-agent contracts, and online listings have all shifted. Here is what FSBO sellers actually need to know right now.',
                'content' => <<<'HTML'
<p>The real estate landscape looks different in 2026 than it did even two years ago. Between the NAR settlement, buyer-agent compensation changes, and the rise of direct-to-buyer platforms, FSBO sellers have more leverage — and more decisions to make.</p>
<h2>Buyer agents now negotiate their own commission</h2>
<p>Buyers increasingly sign a representation agreement with their agent before touring homes. That agreement spells out what the buyer's agent will be paid — often by the buyer, sometimes split with the seller. As an FSBO seller, you decide up front whether you are willing to offer anything toward that fee.</p>
<h2>MLS is no longer the only pipe</h2>
<p>Listings now propagate through portals, syndication networks, and FSBO marketplaces. A well-optimized listing on a commission-free site can reach the same buyers an MLS listing would, with better margin for you.</p>
<h2>Pricing is faster and more data-driven</h2>
<p>AVMs (automated valuation models) give you a tight price range in seconds. Use three sources — one should be your platform's comp tool — and price to the middle of the range, not the top.</p>
<h2>Virtual showings are normal</h2>
<p>About 40% of buyers now expect a video walk-through before they tour in person. A 3-minute unedited phone walk-through is usually enough; you do not need drones or matterport for most homes.</p>
HTML,
                'image' => '/images/sell-img-2.webp',
            ],
            [
                'title' => 'How to Write a Listing Description That Actually Gets Showings',
                'excerpt' => 'Stop copying the tired "charming home in a great location" template. Here is the structure top listings use, with examples.',
                'content' => <<<'HTML'
<p>The listing description is the one place you get to sell a story instead of a spec sheet. Most FSBO descriptions bury the best features in a generic paragraph. Here is a better structure.</p>
<h2>Line 1 — the hook</h2>
<p>One sentence. What makes this home memorable? <em>"Corner lot bungalow with a south-facing yard and the only finished attic on the block."</em> That is more useful than "Beautiful home with lots of natural light."</p>
<h2>Lines 2–3 — the why-now</h2>
<p>What is this home actually set up for? Working from home, hosting, multi-generational living, dog owners, commuters? Name the buyer and speak to them.</p>
<h2>Middle — three specific details</h2>
<p>Exact details beat vague adjectives every time. "New 50-year roof (2024)" is stronger than "well-maintained." "Eight-minute walk to the Metro" is stronger than "close to transit."</p>
<h2>Close — one soft line</h2>
<p>End on a line that invites the tour. <em>"Come see it Saturday — the morning light in the kitchen sells itself."</em></p>
<h2>Skip these words</h2>
<p>"Must see," "won't last," "rare opportunity," "diamond in the rough." They signal a generic listing and buyers scroll past them.</p>
HTML,
                'image' => '/images/home-img.webp',
            ],
            [
                'title' => 'Closing Costs 101: What First-Time Buyers Actually Pay',
                'excerpt' => 'Beyond the down payment, first-time buyers are often surprised by 2–5% in closing costs. Here is a line-by-line breakdown.',
                'content' => <<<'HTML'
<p>Most first-time buyers plan for the down payment and then get blindsided at closing. Typical closing costs run 2–5% of the purchase price. On a $400,000 home that is $8,000–$20,000 on top of the down payment.</p>
<h2>Lender fees ($1,500–$3,000)</h2>
<p>Origination, underwriting, credit report, and sometimes a discount point. Always ask for a Loan Estimate from two lenders and compare line by line — these fees are negotiable.</p>
<h2>Third-party fees ($1,500–$4,000)</h2>
<p>Appraisal, title search, title insurance, survey, recording fees. Title insurance in particular varies a lot by state and carrier — shop it.</p>
<h2>Prepaids and escrow ($2,000–$8,000)</h2>
<p>Prepaid interest, homeowner's insurance premium, and an escrow cushion for future property taxes + insurance. The lender collects these at closing.</p>
<h2>Buyer's agent compensation</h2>
<p>Depending on your buyer-agent agreement, you may be paying your agent directly at closing rather than having it come out of the seller's side. Ask before you sign.</p>
<h2>Negotiable: seller concessions</h2>
<p>In many markets sellers will credit 1–3% toward buyer closing costs, especially on FSBO deals where the seller is already ahead on commission savings. Ask.</p>
HTML,
                'image' => '/images/buyer-2.webp',
            ],
            [
                'title' => 'The 30-Day Pre-Listing Checklist (What to Do Before You Go Live)',
                'excerpt' => 'A day-by-day plan for the month before your listing hits the market — from documents to deep cleaning to day-of-photo prep.',
                'content' => <<<'HTML'
<p>Great FSBO listings are built in the month <em>before</em> they go live, not after. Here is the 30-day runway we recommend.</p>
<h2>Days 30–21: Documents</h2>
<ul>
<li>Pull your deed, last two years of property tax statements, HOA documents, and permit records.</li>
<li>Request a current payoff quote from your mortgage servicer — good for 30 days.</li>
<li>Decide whether you will do a pre-listing inspection. (For homes over 20 years old, it usually pays for itself.)</li>
</ul>
<h2>Days 20–14: Repairs</h2>
<p>Fix the obvious: the dripping faucet, the loose handrail, the bulb over the stairs. Do not start anything you cannot finish in a weekend.</p>
<h2>Days 13–7: Declutter and paint</h2>
<p>Empty closets to 50% full. Clear countertops. Repaint any wall color that is not neutral. Rent a storage unit if you need to.</p>
<h2>Days 6–3: Deep clean + landscape</h2>
<p>Professional deep clean of every room including baseboards. Mow, edge, trim, and mulch. This is what photos will capture.</p>
<h2>Days 2–1: Photos + listing copy</h2>
<p>Shoot on an overcast morning if possible — the light is even and kind to interiors. Write the listing copy the night before you go live, then sleep on it and edit once in the morning.</p>
HTML,
                'image' => '/images/seller-resources.webp',
            ],
            [
                'title' => 'What Buyers Look for in the First 10 Seconds of a Listing',
                'excerpt' => 'Eye-tracking data and conversion research on what makes a buyer click versus scroll past a property listing.',
                'content' => <<<'HTML'
<p>Buyers decide whether to click a listing in about 8–10 seconds. Here is what actually earns that click, ranked.</p>
<h2>1. The hero photo</h2>
<p>A bright, straight-on, wide-angle exterior shot in good light. That is it. Kitchen photos as the hero under-perform exterior photos by about 30% in click-through across most portals.</p>
<h2>2. The price, relative to the area</h2>
<p>Buyers are not looking for "cheap" — they are looking for priced-right. A slightly-under-market list price often gets 2–3x the click-through of an at-market one.</p>
<h2>3. The bed/bath/sqft line</h2>
<p>Three numbers. No commentary needed. Buyers filter by these hard.</p>
<h2>4. The first line of the description</h2>
<p>On most portals only the first 100–120 characters are visible without a click. Make that line count — lead with the most specific, memorable detail.</p>
<h2>What does not matter as much as you think</h2>
<ul>
<li>The listing address — buyers already know the neighborhood from the search.</li>
<li>Your agent/owner photo.</li>
<li>How many photos total. (10 well-lit photos beat 35 mediocre ones every time.)</li>
</ul>
HTML,
                'image' => '/images/home-img-2.webp',
            ],
        ];

        $this->seedCategory($sellerArticles, 'seller');
        $this->seedCategory($buyerArticles, 'buyer');
        $this->seedCategory($blogArticles, 'blog');
    }

    private function seedCategory(array $articles, string $category): void
    {
        foreach ($articles as $article) {
            $slug = Str::slug($article['title']);
            $content = $article['content']
                ?? ($article['excerpt'] . "\n\nThis article provides detailed information to help you navigate your home "
                    . ($category === 'buyer' ? 'buying' : 'selling')
                    . ' journey. Check back soon for the full article content.');

            Resource::updateOrCreate(
                ['slug' => $slug],
                [
                    'title' => $article['title'],
                    'excerpt' => $article['excerpt'],
                    'content' => $content,
                    'category' => $category,
                    'image' => $article['image'] ?? null,
                    'is_published' => true,
                    'published_at' => now(),
                ]
            );
        }
    }
}
