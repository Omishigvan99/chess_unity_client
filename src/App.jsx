import AppLayout from './AppLayout'
import './constants/colors'
import CustomThemeContextProvider from './context/customTheme.context'
function App() {
    return (
        <>
            <CustomThemeContextProvider>
                <AppLayout />
            </CustomThemeContextProvider>
        </>
    )
}

export default App
