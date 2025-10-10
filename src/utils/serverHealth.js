/**
 * Server health utilities and configuration
 */

/**
 * Get server health check configuration based on environment
 */
export const getHealthCheckConfig = () => {
    const isDevelopment = import.meta.env.MODE === 'development'
    const skipHealthCheck = import.meta.env.VITE_SKIP_HEALTH_CHECK === 'true'

    return {
        enabled: !skipHealthCheck,
        pollInterval: isDevelopment ? 1000 : 2000, // Poll faster in development
        maxRetries: isDevelopment ? 10 : 30, // Fewer retries in development
        timeout: isDevelopment ? 3000 : 5000, // Shorter timeout in development
        showDetailedStatus: isDevelopment, // Show more details in development
    }
}

/**
 * Check if we should skip health check entirely
 * This can be useful during development
 */
export const shouldSkipHealthCheck = () => {
    return import.meta.env.VITE_SKIP_HEALTH_CHECK === 'true'
}

/**
 * Get the server URL for health checks
 */
export const getServerHealthUrl = () => {
    const baseUrl = import.meta.env.VITE_API_URL
    if (!baseUrl) {
        console.warn('VITE_API_URL not configured. Health check may fail.')
        return 'http://localhost:4000'
    }
    return baseUrl
}

/**
 * Validate server health response
 */
export const isValidHealthResponse = (response) => {
    return (
        response &&
        response.data &&
        (response.data.status === 'ok' || response.data.status === 'ready')
    )
}
