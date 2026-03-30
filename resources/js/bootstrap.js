import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;

// Set CSRF token from meta tag for all requests
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

// Track if we're already refreshing to avoid infinite loops
let isRefreshing = false;
let refreshPromise = null;

// Helper function to refresh CSRF token
const refreshCsrfToken = async () => {
    if (isRefreshing) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = fetch('/csrf-token', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to refresh CSRF token');
    })
    .then(data => {
        if (data.token) {
            // Update the meta tag
            const metaTag = document.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                metaTag.setAttribute('content', data.token);
            }
            // Update axios defaults
            window.axios.defaults.headers.common['X-CSRF-TOKEN'] = data.token;
            return data.token;
        }
        throw new Error('No token in response');
    })
    .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
    });

    return refreshPromise;
};

// Intercept 419 errors (CSRF token mismatch) and refresh the token
window.axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Only retry once and only for 419 errors
        if (error.response?.status === 419 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshCsrfToken();

                // Update the original request's header
                originalRequest.headers['X-CSRF-TOKEN'] = newToken;

                // If the request had FormData, we need to handle it specially
                // The original FormData is still intact in originalRequest.data

                return window.axios.request(originalRequest);
            } catch (refreshError) {
                console.error('Failed to refresh CSRF token:', refreshError);
                // If token refresh fails, user likely needs to log in again
                // Redirect to login page
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

// Export refresh function for manual use if needed
window.refreshCsrfToken = refreshCsrfToken;
