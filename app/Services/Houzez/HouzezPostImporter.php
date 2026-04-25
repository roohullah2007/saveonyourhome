<?php

namespace App\Services\Houzez;

use App\Models\Resource;
use Illuminate\Support\Str;

/**
 * Imports `wp_posts` rows where post_type='post' (blog posts) into the
 * Laravel `resources` table. The first attached `category` term name becomes
 * the Resource.category. Featured images are *not* re-downloaded — we just
 * record the original attachment URL. Idempotent via wp_id.
 */
class HouzezPostImporter
{
    /** @return array{imported:int, updated:int, skipped:int} */
    public function run(): array
    {
        $imported = 0;
        $updated = 0;
        $skipped = 0;

        $rows = HouzezDb::table('posts')
            ->where('post_type', 'post')
            ->whereIn('post_status', ['publish', 'draft', 'pending', 'private'])
            ->orderBy('ID')
            ->get();

        foreach ($rows as $wp) {
            $title = trim((string) $wp->post_title);
            if ($title === '') { $skipped++; continue; }

            $existing = Resource::where('wp_id', $wp->ID)->first();
            $isNew = !$existing;

            $category = $this->firstCategory((int) $wp->ID) ?? 'Blog';
            $featured = $this->featuredImageUrl((int) $wp->ID);
            $slug = $this->uniqueSlug(
                $wp->post_name ?: Str::slug($title),
                $existing?->id,
            );

            $data = [
                'wp_id' => (int) $wp->ID,
                'title' => $title,
                'slug' => $slug,
                'excerpt' => trim((string) $wp->post_excerpt) ?: null,
                'content' => (string) $wp->post_content,
                'category' => $category,
                'image' => $featured,
                'is_published' => $wp->post_status === 'publish',
                'published_at' => $wp->post_status === 'publish' ? $wp->post_date : null,
                'created_at' => $wp->post_date,
                'updated_at' => $wp->post_modified,
            ];

            if ($existing) {
                $existing->fill($data)->save();
                $updated++;
            } else {
                Resource::create($data);
                $imported++;
            }
        }

        return compact('imported', 'updated', 'skipped');
    }

    /**
     * Resources have a unique slug. WordPress tolerates duplicate post_names
     * across post types, so we append `-N` until we find a free slug. The
     * existing record is excluded so re-imports don't bump their own slug.
     */
    private function uniqueSlug(string $base, ?int $ignoreId): string
    {
        $base = trim($base) ?: 'post';
        $slug = $base;
        $i = 1;
        while (Resource::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = $base . '-' . (++$i);
        }
        return $slug;
    }

    private function firstCategory(int $postId): ?string
    {
        $term = HouzezDb::table('term_relationships')
            ->join('wp_term_taxonomy', 'wp_term_relationships.term_taxonomy_id', '=', 'wp_term_taxonomy.term_taxonomy_id')
            ->join('wp_terms', 'wp_term_taxonomy.term_id', '=', 'wp_terms.term_id')
            ->where('wp_term_relationships.object_id', $postId)
            ->where('wp_term_taxonomy.taxonomy', 'category')
            ->orderBy('wp_term_taxonomy.term_taxonomy_id')
            ->first(['wp_terms.name']);
        return $term?->name;
    }

    private function featuredImageUrl(int $postId): ?string
    {
        $thumbId = HouzezDb::table('postmeta')
            ->where('post_id', $postId)
            ->where('meta_key', '_thumbnail_id')
            ->value('meta_value');
        if (!$thumbId) return null;
        $att = HouzezDb::table('posts')->where('ID', (int) $thumbId)->first(['guid']);
        return $att?->guid ?: null;
    }
}
