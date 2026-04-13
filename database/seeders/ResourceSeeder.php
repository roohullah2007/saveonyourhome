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
            ['title' => 'Tips for Hosting a Successful Open House', 'excerpt' => 'Learn how to prepare your home for an open house that attracts serious buyers and generates competitive offers.'],
            ['title' => 'Strategies for Setting The Sales Price On Your Home', 'excerpt' => 'Discover proven pricing strategies that help you sell your home faster while maximizing your return.'],
            ['title' => 'When to Hire an Attorney for Your FSBO Home Sale', 'excerpt' => 'Understanding when legal expertise is essential in your FSBO journey to protect your interests.'],
            ['title' => 'Expert Tips for a Seamless FSBO Experience', 'excerpt' => 'From listing to closing, get expert advice to make your For Sale By Owner experience smooth and profitable.'],
            ['title' => 'Maximizing Safety When Selling Your Home On Your Own', 'excerpt' => 'Essential safety tips for showing your home and meeting potential buyers during the FSBO process.'],
            ['title' => 'DIY Home Photography and Staging: Tips for Cost-Conscious Sellers', 'excerpt' => 'Take professional-quality photos and stage your home beautifully without breaking the bank.'],
            ['title' => 'Selling Your Home: FSBO vs. Real Estate Agent – How to Decide', 'excerpt' => 'A comprehensive comparison to help you choose the best approach for selling your property.'],
            ['title' => 'Avoid the Pitfalls of Selling By Owner', 'excerpt' => 'Common mistakes FSBO sellers make and how to avoid them for a successful home sale.'],
        ];

        $buyerArticles = [
            ['title' => 'Secure Your Dream Home: The Power of a Pre-Approval in Home Buying', 'excerpt' => 'Why getting pre-approved is the most important first step in your home buying journey.'],
            ['title' => 'Transforming Real Estate: The SaveOnYourHome.com Difference', 'excerpt' => 'How SaveOnYourHome.com is revolutionizing the way people buy and sell homes.'],
            ['title' => 'Market Updates: FSBO Insights and Opportunities', 'excerpt' => 'Stay informed with the latest FSBO market trends, data, and opportunities for buyers.'],
            ['title' => 'Why Buyers Love FSBO Homes: A Deep Dive', 'excerpt' => 'Discover the advantages of buying directly from homeowners and how it can save you money.'],
        ];

        foreach ($sellerArticles as $article) {
            Resource::firstOrCreate(
                ['slug' => Str::slug($article['title'])],
                [
                    'title' => $article['title'],
                    'slug' => Str::slug($article['title']),
                    'excerpt' => $article['excerpt'],
                    'content' => $article['excerpt'] . "\n\nThis article provides detailed information to help you navigate your home selling journey. Check back soon for the full article content.",
                    'category' => 'seller',
                    'is_published' => true,
                    'published_at' => now(),
                ]
            );
        }

        foreach ($buyerArticles as $article) {
            Resource::firstOrCreate(
                ['slug' => Str::slug($article['title'])],
                [
                    'title' => $article['title'],
                    'slug' => Str::slug($article['title']),
                    'excerpt' => $article['excerpt'],
                    'content' => $article['excerpt'] . "\n\nThis article provides detailed information to help you navigate your home buying journey. Check back soon for the full article content.",
                    'category' => 'buyer',
                    'is_published' => true,
                    'published_at' => now(),
                ]
            );
        }
    }
}
