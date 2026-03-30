<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BunnyCDNService
{
    protected string $hostname;
    protected string $username;
    protected string $password;
    protected int $port;
    protected string $pullZone;
    protected $connection = null;

    public function __construct()
    {
        $this->hostname = config('services.bunnycdn.hostname');
        $this->username = config('services.bunnycdn.username');
        $this->password = config('services.bunnycdn.password');
        $this->port = (int) config('services.bunnycdn.port', 21);
        $this->pullZone = config('services.bunnycdn.pull_zone');
    }

    /**
     * Check if Bunny CDN is configured
     */
    public static function isConfigured(): bool
    {
        return !empty(config('services.bunnycdn.hostname'))
            && !empty(config('services.bunnycdn.username'))
            && !empty(config('services.bunnycdn.password'))
            && !empty(config('services.bunnycdn.pull_zone'));
    }

    /**
     * Get the CDN URL for a given path
     */
    public static function getUrl(string $path): string
    {
        if (!self::isConfigured()) {
            // Fallback to local storage URL
            return $path;
        }

        $pullZone = config('services.bunnycdn.pull_zone');

        // If path already has full URL, return as is
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        // Remove leading slash if present
        $path = ltrim($path, '/');

        // Remove 'storage/' prefix if present (old local paths)
        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, 8);
        }

        return "https://{$pullZone}/{$path}";
    }

    /**
     * Convert a local storage path to CDN path
     * E.g., /storage/properties/uuid.webp -> properties/uuid.webp
     */
    public static function pathToCdnPath(string $localPath): string
    {
        // Remove /storage/ prefix
        $path = str_replace('/storage/', '', $localPath);
        return ltrim($path, '/');
    }

    /**
     * Connect to FTP server
     */
    protected function connect(): bool
    {
        if ($this->connection) {
            return true;
        }

        try {
            $this->connection = ftp_connect($this->hostname, $this->port, 30);

            if (!$this->connection) {
                Log::error('BunnyCDN: Failed to connect to FTP server', [
                    'hostname' => $this->hostname,
                    'port' => $this->port
                ]);
                return false;
            }

            // Enable passive mode
            ftp_pasv($this->connection, true);

            // Login
            if (!ftp_login($this->connection, $this->username, $this->password)) {
                Log::error('BunnyCDN: FTP login failed', [
                    'username' => $this->username
                ]);
                $this->disconnect();
                return false;
            }

            Log::info('BunnyCDN: Successfully connected to FTP server');
            return true;
        } catch (\Exception $e) {
            Log::error('BunnyCDN: Connection error', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Disconnect from FTP server
     */
    protected function disconnect(): void
    {
        if ($this->connection) {
            ftp_close($this->connection);
            $this->connection = null;
        }
    }

    /**
     * Ensure directory exists on FTP server
     */
    protected function ensureDirectoryExists(string $directory): bool
    {
        if (!$this->connect()) {
            return false;
        }

        $parts = explode('/', trim($directory, '/'));
        $currentPath = '';

        foreach ($parts as $part) {
            if (empty($part)) continue;

            $currentPath .= '/' . $part;

            // Try to change to directory, create if it doesn't exist
            if (!@ftp_chdir($this->connection, $currentPath)) {
                if (!@ftp_mkdir($this->connection, $currentPath)) {
                    // Directory might already exist or we can't create it
                    Log::warning('BunnyCDN: Could not create/access directory', [
                        'directory' => $currentPath
                    ]);
                }
            }
        }

        // Go back to root
        @ftp_chdir($this->connection, '/');

        return true;
    }

    /**
     * Upload a file to Bunny CDN
     *
     * @param string $localPath Full path to local file
     * @param string $remotePath Path on CDN (e.g., properties/uuid.webp)
     * @return bool
     */
    public function upload(string $localPath, string $remotePath): bool
    {
        if (!$this->connect()) {
            return false;
        }

        try {
            // Ensure directory exists
            $directory = dirname($remotePath);
            if ($directory !== '.' && $directory !== '/') {
                $this->ensureDirectoryExists($directory);
            }

            // Upload the file
            $result = ftp_put($this->connection, '/' . ltrim($remotePath, '/'), $localPath, FTP_BINARY);

            if ($result) {
                Log::info('BunnyCDN: File uploaded successfully', [
                    'remote_path' => $remotePath
                ]);
            } else {
                Log::error('BunnyCDN: Failed to upload file', [
                    'local_path' => $localPath,
                    'remote_path' => $remotePath
                ]);
            }

            return $result;
        } catch (\Exception $e) {
            Log::error('BunnyCDN: Upload error', [
                'error' => $e->getMessage(),
                'local_path' => $localPath,
                'remote_path' => $remotePath
            ]);
            return false;
        }
    }

    /**
     * Upload content directly (from memory/string)
     *
     * @param string $content File content
     * @param string $remotePath Path on CDN
     * @return bool
     */
    public function uploadContent(string $content, string $remotePath): bool
    {
        // Create a temporary file
        $tempFile = tempnam(sys_get_temp_dir(), 'bunny_');
        file_put_contents($tempFile, $content);

        $result = $this->upload($tempFile, $remotePath);

        // Clean up temp file
        @unlink($tempFile);

        return $result;
    }

    /**
     * Delete a file from Bunny CDN
     *
     * @param string $remotePath Path on CDN
     * @return bool
     */
    public function delete(string $remotePath): bool
    {
        if (!$this->connect()) {
            return false;
        }

        try {
            $result = @ftp_delete($this->connection, '/' . ltrim($remotePath, '/'));

            if ($result) {
                Log::info('BunnyCDN: File deleted successfully', [
                    'remote_path' => $remotePath
                ]);
            } else {
                Log::warning('BunnyCDN: Could not delete file (may not exist)', [
                    'remote_path' => $remotePath
                ]);
            }

            return $result;
        } catch (\Exception $e) {
            Log::error('BunnyCDN: Delete error', [
                'error' => $e->getMessage(),
                'remote_path' => $remotePath
            ]);
            return false;
        }
    }

    /**
     * Check if a file exists on Bunny CDN
     *
     * @param string $remotePath Path on CDN
     * @return bool
     */
    public function exists(string $remotePath): bool
    {
        if (!$this->connect()) {
            return false;
        }

        try {
            $size = @ftp_size($this->connection, '/' . ltrim($remotePath, '/'));
            return $size !== -1;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Destructor - ensure connection is closed
     */
    public function __destruct()
    {
        $this->disconnect();
    }
}
