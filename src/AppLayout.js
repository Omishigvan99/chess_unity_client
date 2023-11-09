import React, { useState } from 'react'

import HeaderNav from './Components/HeaderNav'

import { Layout, theme } from 'antd'
import SideNav from './Components/SideNav'
import MainContainer from './Components/MainContainer'

const AppLayout = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const [openLogin, setOpenLogin] = useState({
        id: 0,
        state: false,
    })

    const [openPopup, setOpenPopup] = useState(false)

    const handleMenuClick = (e) => {
        // e.preventDefault
        e.key === '11' || e.key === '12'
            ? setOpenLogin({
                  id: e.key,
                  state: true,
              })
            : setOpenLogin({ id: e.key, state: false })

        e.key === '1' ? setOpenPopup(true) : setOpenPopup(false)
    }
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <SideNav
                handleMenuClick={handleMenuClick}
                setOpenLogin={setOpenLogin}
                openLogin={openLogin}
            />

            <Layout>
                <HeaderNav />
                <MainContainer
                    setOpenLogin={setOpenLogin}
                    openLogin={openLogin}
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                />
            </Layout>
        </Layout>
    )
}
export default AppLayout
