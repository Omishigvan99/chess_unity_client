import React from 'react'
import { Layout, theme } from 'antd'
const { Header } = Layout

const HeaderNav = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()
    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
                textAlign: 'right',
            }}
        ></Header>
    )
}

export default HeaderNav
