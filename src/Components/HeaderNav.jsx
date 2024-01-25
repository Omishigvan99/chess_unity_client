import { useContext } from 'react'
import { Layout, Button, Space, ConfigProvider } from 'antd'
import { ModalContext } from '../context/modal.context'
import { SidenavContext } from '../context/sidenav.context'
import { MenuOutlined } from '@ant-design/icons'

const { Header } = Layout

const HeaderNav = ({ username = ' Max', isLoggedIn }) => {
    const { collapsed, setCollapsed, broken } = useContext(SidenavContext)
    const { setOpenLogin, setOpenSignup } = useContext(ModalContext)
    const { componentSize } = ConfigProvider.useConfig()
    let hideContent = false

    //if the screen is broken and the side nav is collapsed then hide the content in mobile view
    if (broken && !collapsed) {
        hideContent = true
    } else if (broken && collapsed) {
        hideContent = false
    } else {
        hideContent = false
    }

    return (
        <Header
            style={{
                ...styles.header,
            }}
        >
            {!hideContent && (
                <Button
                    type="primary"
                    onClick={() => {
                        setCollapsed(!collapsed)
                    }}
                    icon={<MenuOutlined />}
                    size={componentSize}
                ></Button>
            )}
            {!hideContent && (
                <Space style={styles.buttonContainer}>
                    <Button
                        type="primary"
                        onClick={() => {
                            setOpenLogin(true)
                        }}
                        size={componentSize}
                    >
                        Login
                    </Button>
                    <Button
                        onClick={() => {
                            setOpenSignup(true)
                        }}
                        size={componentSize}
                    >
                        Signup
                    </Button>
                </Space>
            )}
        </Header>
    )
}

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        overflow: 'hidden',
    },
    buttonContainer: {
        marginLeft: 'auto',
    },
}

export default HeaderNav
