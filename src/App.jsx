import AppLayout from './AppLayout'
import './constants/colors'
import CustomThemeContextProvider from './context/customTheme.context'
import StoreProvider from './store/global.store'

function App() {
    return (
        <>
            <CustomThemeContextProvider>
                <StoreProvider>
                    <AppLayout />
                </StoreProvider>
            </CustomThemeContextProvider>
        </>
    )
}

export default App
