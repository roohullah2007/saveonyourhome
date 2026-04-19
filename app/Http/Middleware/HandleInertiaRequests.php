<?php

namespace App\Http\Middleware;

use App\Models\CompanyLogo;
use App\Models\Inquiry;
use App\Models\TaxonomyTerm;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'unreadMessages' => fn () => $request->user()
                    ? (function() use ($request) {
                        $user = $request->user();
                        $userId = $user->id;
                        $propertyIds = $user->properties()->pluck('id');
                        $hasProperties = $propertyIds->isNotEmpty();

                        return Inquiry::where(function($q) use ($propertyIds, $hasProperties, $user) {
                            if ($hasProperties) $q->whereIn('property_id', $propertyIds);
                            $q->orWhere(function($q2) use ($user) {
                                $q2->where(function($q3) use ($user) {
                                    $q3->where('user_id', $user->id)->orWhere('email', $user->email);
                                })->whereNotNull('seller_reply');
                            });
                        })->where(function($q) use ($userId) {
                            $q->whereNotExists(function($sub) use ($userId) {
                                $sub->select(\DB::raw(1))
                                    ->from('inquiry_views')
                                    ->whereColumn('inquiry_views.inquiry_id', 'inquiries.id')
                                    ->where('inquiry_views.user_id', $userId);
                            })->orWhereExists(function($sub) use ($userId) {
                                $sub->select(\DB::raw(1))
                                    ->from('message_replies')
                                    ->whereColumn('message_replies.inquiry_id', 'inquiries.id')
                                    ->where('message_replies.user_id', '!=', $userId)
                                    ->whereRaw('message_replies.created_at > (SELECT last_seen_at FROM inquiry_views WHERE inquiry_views.inquiry_id = inquiries.id AND inquiry_views.user_id = ? LIMIT 1)', [$userId]);
                            });
                        })->count();
                    })()
                    : 0,
            ],
            'googleMapsApiKey' => config('services.google.maps_api_key'),
            'companyLogos' => fn () => CompanyLogo::getActive(),
            'taxonomies' => fn () => [
                'property_types' => TaxonomyTerm::activeByType(TaxonomyTerm::TYPE_PROPERTY_TYPE),
                'transaction_types' => TaxonomyTerm::activeByType(TaxonomyTerm::TYPE_TRANSACTION_TYPE),
                'listing_labels' => TaxonomyTerm::activeByType(TaxonomyTerm::TYPE_LISTING_LABEL),
                'listing_statuses' => TaxonomyTerm::activeByType(TaxonomyTerm::TYPE_LISTING_STATUS),
            ],
        ];
    }
}
