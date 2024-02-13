import { useContext, useState } from 'react'
import {
    Avatar,
    ConfigProvider,
    Popover,
    Typography,
    theme,
    Button,
    Space,
    Drawer,
} from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { GlobalStore } from '../../store/global.store'
import { logoutHandler } from '../../utils/auth'
import { NotificationContext } from '../../context/notification.context'
import { logout } from '../../store/auth.store'
import UpdateForm from '../forms/Update.form'

const { Text } = Typography

function UserProfile() {
    const [authState, dispatch] = useContext(GlobalStore).auth
    const { openNotification } = useContext(NotificationContext)
    const {
        token: { colorPrimary },
    } = theme.useToken()
    const [openDrawer, setOpenDrawer] = useState(false)

    //logout handler
    async function onLogoutHandler() {
        try {
            await logoutHandler({
                accessToken: authState.accessToken,
            })
            dispatch(logout())
            openNotification(
                'success',
                'Logout Successful',
                'You have been loggedout successfully'
            )
        } catch (error) {
            console.log(error)
            switch (error.message) {
                case 'Logout Error':
                    openNotification(
                        'error',
                        'Logout Error',
                        'Something went wrong while logging out'
                    )
                    break
                default:
                    openNotification(
                        'error',
                        'Unknown Error',
                        'Something went wrong while logging out'
                    )
                    break
            }
            return
        }
    }

    // onEditHandler
    function onEditHandler() {
        setOpenDrawer(true)
    }

    //popover content
    const content = (
        <>
            <Space direction="vertical">
                <Text>Name: {authState.name}</Text>
                <Text>Email: {authState.email}</Text>
                <Text>Username: {authState.username}</Text>
                <Button onClick={onLogoutHandler}>Logout</Button>
                <Button onClick={onEditHandler}>Edit</Button>
            </Space>
        </>
    )

    return (
        <>
            <Popover placement="bottomLeft" content={content}>
                <div style={styles.container}>
                    <Avatar
                        style={{
                            backgroundColor: colorPrimary,
                        }}
                        icon={!authState.avatar ? <UserOutlined /> : null}
                        src={authState.avatar ? authState.avatar : null}
                    ></Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <ConfigProvider
                            theme={{
                                algorithm: theme.darkAlgorithm,
                            }}
                        >
                            <Text>{authState.name}</Text>
                            <Text type="secondary">{authState.username}</Text>
                        </ConfigProvider>
                    </div>
                </div>
            </Popover>
            <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
                <UpdateForm></UpdateForm>
            </Drawer>
        </>
    )
}

const styles = {
    container: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        marginLeft: 'auto',
        lineHeight: 'normal',
    },
}

export default UserProfile
