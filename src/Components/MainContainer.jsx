import React from 'react'
import { Layout, theme } from 'antd'
const { Content } = Layout
const MainContainer = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()
    return (
        <Content
            style={{
                backgroundColor: colorBgContainer,
                overflow: 'auto',
            }}
        ></Content>
    )
}

export default MainContainer
