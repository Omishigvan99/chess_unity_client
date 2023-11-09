import React from 'react'
import SignupView from '../Views/SignupView'
import LoginView from '../Views/LoginView'
import PopupView from '../Views/PopupView'
import { Layout, theme } from 'antd'
const { Content } = Layout
const MainContainer = ({
    openLogin,
    setOpenLogin = () => {},
    openPopup,
    setOpenPopup = () => {},
}) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()
    return (
        <Content
            style={{
                margin: '14px  14px 0  14px',
            }}
        >
            <div
                style={{
                    padding: 24,
                    minHeight: '100%',
                    background: colorBgContainer,
                }}
            >
                {openLogin?.state && openLogin?.id === '11' ? (
                    <LoginView
                        open={openLogin.state}
                        setOpenLogin={setOpenLogin}
                    />
                ) : (
                    <SignupView
                        open={openLogin?.state}
                        setOpenLogin={setOpenLogin}
                    />
                )}

                {openPopup && (
                    <PopupView
                        openPopup={openPopup}
                        setOpenPopup={setOpenPopup}
                    />
                )}
            </div>
        </Content>
    )
}

export default MainContainer
