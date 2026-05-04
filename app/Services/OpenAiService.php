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
    /**
     * Last upstream failure, if any. Callers can read this after chat()
     * returns null to surface a specific error message to the admin
     * instead of a generic "service unavailable".
     */
    private ?string $lastError = null;

    public function isConfigured(): bool
    {
        return filled($this->key());
    }

    /**
     * Read the configured key and strip any whitespace (CR, LF, tabs,
     * leading/trailing spaces). Pastes from the OpenAI dashboard often
     * wrap, and PHP's HTTP client throws "is not valid header value"
     * on any embedded newline — the trim makes that resilient.
     */
    private function key(): ?string
    {
        $raw = config('services.openai.key');
        if (!is_string($raw)) return null;
        $clean = preg_replace('/\s+/', '', $raw);
        return $clean !== '' ? $clean : null;
    }

    public function lastError(): ?string
    {
        return $this->lastError;
    }

    /**
     * Send a chat completion. $messages is the raw OpenAI messages array.
     * Returns the assistant text content on success, or null on failure.
     */
    public function chat(array $messages, array $options = []): ?string
    {
        $this->lastError = null;

        if (!$this->isConfigured()) {
            $this->lastError = 'OpenAI API key is not configured.';
            return null;
        }

        $payload = array_merge([
            'model' => config('services.openai.model', 'gpt-4o-mini'),
            'messages' => $messages,
            'temperature' => 0.7,
        ], $options);

        try {
            $response = Http::withToken($this->key())
                ->timeout(60)
                ->post('https://api.openai.com/v1/chat/completions', $payload);

            if (!$response->successful()) {
                Log::warning('OpenAI request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                $code = $response->json('error.code');
                $msg = $response->json('error.message');
                if ($code === 'insufficient_quota') {
                    $this->lastError = 'OpenAI quota exceeded — top up the account at platform.openai.com/account/billing.';
                } elseif ($code === 'invalid_api_key') {
                    $this->lastError = 'OpenAI API key is invalid — check OPENAI_API_KEY in .env.';
                } elseif ($response->status() === 429) {
                    $this->lastError = 'OpenAI is rate-limiting requests — wait a minute and try again.';
                } elseif ($msg) {
                    $this->lastError = "OpenAI error ({$response->status()}): {$msg}";
                } else {
                    $this->lastError = "OpenAI returned HTTP {$response->status()}.";
                }
                return null;
            }

            return $response->json('choices.0.message.content');
        } catch (\Throwable $e) {
            Log::warning('OpenAI request threw', ['error' => $e->getMessage()]);
            // Strip API keys so they don't leak into the admin UI when
            // the underlying client error includes the Authorization header.
            $msg = preg_replace('/sk-[A-Za-z0-9_\-]{20,}/', 'sk-***', $e->getMessage());
            $this->lastError = 'Could not reach OpenAI: ' . $msg;
            return null;
        }
    }
}
