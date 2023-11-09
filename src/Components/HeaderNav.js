import React from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Layout, theme } from 'antd'
const { Header } = Layout

const HeaderNav = ({ username = ' Max' }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()
    return (
        <Header
            style={{
                padding: 0,
                // background: colorBgContainer,
                textAlign: 'right',
                backgroundColor: '#002140',
            }}
        >
            <div
                style={{
                    margin: '0 15px',
                    fontWeight: 'normal',
                    color: '#fff',
                }}
            >
                <UserOutlined style={{ marginRight: 5 }} />
                {username}
            </div>
        </Header>
    )
}

export default HeaderNav
