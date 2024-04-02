import AppLayout from './AppLayout'
import { BrowserRouter } from 'react-router-dom'
import './constants/colors'
import CustomThemeContextProvider from './context/customTheme.context'
import StoreProvider from './store/global.store'

function App() {
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
