import AppLayout from './AppLayout'
import { BrowserRouter } from 'react-router-dom'
import './constants/colors'
import CustomThemeContextProvider from './context/customTheme.context'
import StoreProvider from './store/global.store'
import ServerLoadingPage from './Components/ServerLoadingPage'
import useServerHealth from './hooks/useServerHealth'
import {
    getHealthCheckConfig,
    shouldSkipHealthCheck,
} from './utils/serverHealth'

function App() {
    const healthConfig = getHealthCheckConfig()

    const {
        isLoading,
        serverStatus,
        retryCount,
        maxRetries,
        error,
        isServerReady,
    } = useServerHealth({
        ...healthConfig,
        onReady: (status) => {
            console.log('Server is ready:', status)
        },
        onError: (err) => {
            console.error('Server health check failed:', err)
        },
    })

    // Skip health check if configured to do so (useful for development)
    if (shouldSkipHealthCheck()) {
        console.log(
            'Skipping server health check (VITE_SKIP_HEALTH_CHECK=true)'
        )
        return (
            <>
                <BrowserRouter>
                    <CustomThemeContextProvider>
                        <StoreProvider>
                            <AppLayout />
                        </StoreProvider>
                    </CustomThemeContextProvider>
                </BrowserRouter>
            </>
        )
    }

    // Show loading page while server is starting up
    if (!isServerReady) {
        return (
            <ServerLoadingPage
                isLoading={isLoading}
                serverStatus={serverStatus}
                retryCount={retryCount}
                maxRetries={maxRetries}
                error={error}
            />
        )
    }

    // Server is ready, show main application
    return (
        <>
            <BrowserRouter>
                <CustomThemeContextProvider>
                    <StoreProvider>
                        <AppLayout />
                    </StoreProvider>
                </CustomThemeContextProvider>
            </BrowserRouter>
        </>
    )
}

export default App
