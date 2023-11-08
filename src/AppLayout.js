import React, { useState } from 'react'
import LoginView from './Views/LoginView'
import SignupView from './Views/SignupView'
import HeaderNav from './Components/HeaderNav'

import { Button, Modal, Input } from 'antd'
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons'
import { Breadcrumb, Layout, Menu, theme, Space } from 'antd'
const { Header, Content, Footer, Sider } = Layout

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    }
}

const items = [
    getItem('Play', '0', <DesktopOutlined />, [
        getItem('Play with friend', '1'),
        getItem('Quick Game', '2'),
    ]),
    getItem('Puzzles', 'sub1', <UserOutlined />, [
        getItem('Solve Puzzle', '3'),
        getItem('Create Puzzle', '4'),
    ]),
    getItem('Tournaments', 'sub2', <TeamOutlined />, [
        getItem('Play Tournament', '6'),
        getItem('Host Tournament', '7'),
        getItem('watch Games', '8'),
    ]),
    getItem('News', 'sub3', <FileOutlined />, [
        getItem('Team 1', '9'),
        getItem('Team 2', '10'),
    ]),
    getItem('Login', '11', <PieChartOutlined />),
    getItem('Signup', '12', <PieChartOutlined />),
]

const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false)

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
            <Sider
                width={'300px'}
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => {
                    setCollapsed(value)
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={items}
                    onClick={(e) => {
                        handleMenuClick(e)
                    }}
                />
            </Sider>
            <Layout>
                <HeaderNav />
                <Content
                    style={{
                        margin: '0 14px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '13px 0',
                        }}
                    >
                        {/* <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                        }}
                    >
                        {openLogin.state && openLogin.id === '11' ? (
                            <LoginView
                                open={openLogin.state}
                                setOpenLogin={setOpenLogin}
                            />
                        ) : (
                            <SignupView
                                open={openLogin.state}
                                setOpenLogin={setOpenLogin}
                            />
                        )}

                        {openPopup && (
                            <PopUp
                                openPopup={openPopup}
                                setOpenPopup={setOpenPopup}
                            />
                        )}
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}
export default AppLayout

export const PopUp = ({ openPopup, setOpenPopup = () => {} }) => {
    const [invite, setInvite] = useState('')

    const onClickHandler = () => {
        alert(invite)
        setOpenPopup(false)
    }
    return (
        <Modal
            open={openPopup}
            onCancel={() => setOpenPopup(false)}
            onOk={() => setOpenPopup(false)}
        >
            <Input
                style={{ marginTop: '20px' }}
                value={invite}
                onChange={(e) => setInvite(e.target.value)}
            />

            <Button
                type="primary"
                style={{ marginTop: '20px' }}
                onClick={() => onClickHandler()}
            >
                Join Room
            </Button>
        </Modal>
    )
}
