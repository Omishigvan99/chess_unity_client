import { useContext } from 'react'

import HeaderNav from './Components/HeaderNav'
import SideNav from './Components/SideNav'
import MainContainer from './Components/MainContainer'

import { ConfigProvider, Layout, theme } from 'antd'
import ModalContextProvider from './context/modal.context'
import NotificationProvider from './context/notification.context'
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
            <NotificationProvider>
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
                </ModalContextProvider>
            </NotificationProvider>
        </ConfigProvider>
    )
}
export default AppLayout
