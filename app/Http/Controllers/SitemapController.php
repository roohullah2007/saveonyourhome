<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Resource;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $baseUrl = rtrim(config('app.url', 'https://saveonyourhome.com'), '/');
        $now = Carbon::now()->toIso8601String();

        $staticPages = [
            ['url' => '/',                   'priority' => '1.0', 'changefreq' => 'daily'],
            ['url' => '/properties',         'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/buyers',             'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => '/buyers-guide',       'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/buyer-faqs',         'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/buyer-resources',    'priority' => '0.7', 'changefreq' => 'weekly'],
            ['url' => '/get-pre-approved',   'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/sell-your-home',     'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => '/fsbo-guide',         'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/seller-faqs',        'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/seller-resources',   'priority' => '0.7', 'changefreq' => 'weekly'],
            ['url' => '/home-worth',         'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/virtual-tours',      'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/partners',           'priority' => '0.6', 'changefreq' => 'weekly'],
            ['url' => '/blog',               'priority' => '0.8', 'changefreq' => 'weekly'],
            ['url' => '/ebook',              'priority' => '0.5', 'changefreq' => 'monthly'],
            ['url' => '/honor-pledge',       'priority' => '0.5', 'changefreq' => 'yearly'],
            ['url' => '/our-packages',       'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/about',              'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/contact',            'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/faqs',               'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/privacy-policy',     'priority' => '0.3', 'changefreq' => 'yearly'],
            ['url' => '/terms-of-use',       'priority' => '0.3', 'changefreq' => 'yearly'],
        ];

        $properties = Property::where('is_active', true)
            ->where('approval_status', 'approved')
            ->select('id', 'address', 'updated_at')
            ->orderByDesc('updated_at')
            ->get();

        $resources = Resource::published()
            ->select('slug', 'updated_at')
            ->orderByDesc('updated_at')
            ->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($staticPages as $page) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($baseUrl . $page['url'], ENT_XML1) . '</loc>';
            $xml .= '<lastmod>' . $now . '</lastmod>';
            $xml .= '<changefreq>' . $page['changefreq'] . '</changefreq>';
            $xml .= '<priority>' . $page['priority'] . '</priority>';
            $xml .= '</url>';
        }

        foreach ($properties as $property) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($baseUrl . '/properties/' . $property->slug, ENT_XML1) . '</loc>';
            $xml .= '<lastmod>' . $property->updated_at->toIso8601String() . '</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.8</priority>';
            $xml .= '</url>';
        }

        foreach ($resources as $resource) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($baseUrl . '/resources/' . $resource->slug, ENT_XML1) . '</loc>';
            $xml .= '<lastmod>' . $resource->updated_at->toIso8601String() . '</lastmod>';
            $xml .= '<changefreq>monthly</changefreq>';
            $xml .= '<priority>0.6</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
            'X-Robots-Tag' => 'noindex',
        ]);
    }
}
