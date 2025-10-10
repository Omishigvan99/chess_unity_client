import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
    getHealthCheckConfig,
    isValidHealthResponse,
} from '../utils/serverHealth'

/**
 * Custom hook to check server health and readiness
 * Polls the server health endpoint until it becomes available
 */
const useServerHealth = (options = {}) => {
    const defaultConfig = getHealthCheckConfig()
    const {
        pollInterval = defaultConfig.pollInterval,
        maxRetries = defaultConfig.maxRetries,
        timeout = defaultConfig.timeout,
        enabled = defaultConfig.enabled,
        onReady = () => {},
        onError = () => {},
    } = { ...defaultConfig, ...options }

    const [isLoading, setIsLoading] = useState(enabled)
    const [serverStatus, setServerStatus] = useState(null)
    const [retryCount, setRetryCount] = useState(0)
    const [error, setError] = useState(null)

    const healthEndpoint = `${import.meta.env.VITE_API_URL}/health`

    const checkServerHealth = useCallback(async () => {
        if (!enabled) {
            setIsLoading(false)
            return true
        }

        try {
            console.log(
                `Checking server health... Attempt ${
                    retryCount + 1
                }/${maxRetries}`
            )

            const response = await axios.get(healthEndpoint, {
                timeout,
                withCredentials: true,
                // Add headers to prevent caching
                headers: {
                    'Cache-Control': 'no-cache',
                    Pragma: 'no-cache',
                },
            })

            if (isValidHealthResponse(response)) {
                console.log('Server is healthy:', response.data)
                setServerStatus(response.data)
                setIsLoading(false)
                setError(null)
                onReady(response.data)
                return true
            } else {
                throw new Error('Invalid server response')
            }
        } catch (err) {
            console.warn(
                `Health check failed (attempt ${retryCount + 1}):`,
                err.message
            )

            if (retryCount >= maxRetries - 1) {
                console.error(
                    'Max retries exceeded. Server appears to be unavailable.'
                )
                setError(err)
                setIsLoading(false)
                onError(err)
                return false
            }

            setRetryCount((prev) => prev + 1)
            return false
        }
    }, [
        healthEndpoint,
        timeout,
        retryCount,
        maxRetries,
        enabled,
        onReady,
        onError,
    ])

    const resetHealthCheck = useCallback(() => {
        setIsLoading(true)
        setServerStatus(null)
        setRetryCount(0)
        setError(null)
    }, [])

    useEffect(() => {
        let intervalId
        let timeoutId

        const startHealthCheck = async () => {
            const isHealthy = await checkServerHealth()

            if (isHealthy) {
                // Server is healthy, stop polling
                return
            }

            if (retryCount < maxRetries - 1) {
                // Schedule next check
                timeoutId = setTimeout(() => {
                    startHealthCheck()
                }, pollInterval)
            }
        }

        if (enabled && isLoading) {
            startHealthCheck()
        }

        return () => {
            if (intervalId) clearInterval(intervalId)
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [
        retryCount,
        checkServerHealth,
        pollInterval,
        maxRetries,
        enabled,
        isLoading,
    ])

    return {
        isLoading,
        serverStatus,
        retryCount,
        maxRetries,
        error,
        resetHealthCheck,
        isServerReady: !isLoading && !error && serverStatus?.status === 'ok',
    }
}

export default useServerHealth
