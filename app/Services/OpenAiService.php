<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Thin wrapper around the OpenAI Chat Completions endpoint.
 *
 * Returns null when no key is configured or the upstream call fails, so
 * callers can fall back to a template without crashing the user flow.
 */
class OpenAiService
{
    public function isConfigured(): bool
    {
        return filled(config('services.openai.key'));
    }

    /**
     * Send a chat completion. $messages is the raw OpenAI messages array.
     * Returns the assistant text content on success, or null on failure.
     */
    public function chat(array $messages, array $options = []): ?string
    {
        if (!$this->isConfigured()) {
            return null;
        }

        $payload = array_merge([
            'model' => config('services.openai.model', 'gpt-4o-mini'),
            'messages' => $messages,
            'temperature' => 0.7,
        ], $options);

        try {
            $response = Http::withToken(config('services.openai.key'))
                ->timeout(60)
                ->post('https://api.openai.com/v1/chat/completions', $payload);

            if (!$response->successful()) {
                Log::warning('OpenAI request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            return $response->json('choices.0.message.content');
        } catch (\Throwable $e) {
            Log::warning('OpenAI request threw', ['error' => $e->getMessage()]);
            return null;
        }
    }
}
