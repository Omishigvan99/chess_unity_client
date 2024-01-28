import { useContext } from 'react'

import HeaderNav from './Components/HeaderNav'
import SideNav from './Components/SideNav'
import MainContainer from './Components/MainContainer'
import Login from './Components/modals/Login'
import Signup from './Components/modals/Signup'

import { ConfigProvider, Layout, theme } from 'antd'
import ModalContextProvider from './context/sidenav.context'
import SidenavContextProvider from './context/sidenav.context'
import { CustomThemeContext } from './context/customTheme.context'

const AppLayout = () => {
    const { colorStyle } = useContext(CustomThemeContext)
    return (
        <ConfigProvider
            componentSize="large"
            theme={{
                algorithm:
                    colorStyle === 'dark'
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm,
            }}
        >
            <ModalContextProvider>
                <Layout
                    style={{
                        display: 'flex',
                    }}
                >
                    <SidenavContextProvider>
                        <SideNav />
                        <Layout>
                            <HeaderNav />
                            <MainContainer />
                        </Layout>
                    </SidenavContextProvider>
                </Layout>
                {/* Setting up modals*/}
                <Login></Login>
                <Signup></Signup>
            </ModalContextProvider>
        </ConfigProvider>
    )
}
export default AppLayout
