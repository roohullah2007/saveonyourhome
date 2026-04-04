<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $properties = Property::where('is_active', true)
            ->where('approval_status', 'approved')
            ->select('slug', 'updated_at')
            ->orderByDesc('updated_at')
            ->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Static pages
        $staticPages = [
            ['url' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['url' => '/properties', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/buyers', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => '/sellers', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => '/about', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/contact', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/faqs', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/mortgages', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/our-packages', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/privacy-policy', 'priority' => '0.3', 'changefreq' => 'yearly'],
            ['url' => '/terms-of-use', 'priority' => '0.3', 'changefreq' => 'yearly'],
        ];

        $baseUrl = config('app.url', 'https://saveonyourhome.com');

        foreach ($staticPages as $page) {
            $xml .= '<url>';
            $xml .= '<loc>' . $baseUrl . $page['url'] . '</loc>';
            $xml .= '<changefreq>' . $page['changefreq'] . '</changefreq>';
            $xml .= '<priority>' . $page['priority'] . '</priority>';
            $xml .= '</url>';
        }

        // Property pages
        foreach ($properties as $property) {
            $xml .= '<url>';
            $xml .= '<loc>' . $baseUrl . '/properties/' . $property->slug . '</loc>';
            $xml .= '<lastmod>' . $property->updated_at->toIso8601String() . '</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.8</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
