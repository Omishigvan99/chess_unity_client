import { useContext, useState } from 'react'
import {
    DesktopOutlined,
    TeamOutlined,
    UserOutlined,
    BarChartOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd'
import { useNavigate } from 'react-router-dom'
import { SidenavContext } from '../context/sidenav.context'
import { CustomThemeContext } from '../context/customTheme.context'
import MenuTrigger from './UI/MenuTrigger'
import DarkTrigger from './UI/DarkTrigger'
import { ModalContext } from '../context/modal.context'
const { Sider } = Layout

//helper function to create menu items
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    }
}

//configuring menu items for side nav
const items = [
    getItem('Dashboard', 'dashboard', <BarChartOutlined />),
    getItem('Play', 'play', <PlayCircleOutlined />, [
        // getItem('Play with computer', 'play-computer'),
        getItem('Play with a friend', 'play-friend', null, [
            getItem('Create Game', 'create-game'),
            getItem('Join Game', 'join-game'),
        ]),
        getItem('Play with a computer', 'play-computer'),
    ]),
    {
        type: 'divider',
    },
]

//configuring secondary menu items for side nav for collapsed view
const secondaryItems = [
    getItem('Dark Mode', 'dark-mode', <DesktopOutlined />, [
        getItem('ON', 'dark-mode-on'),
        getItem('OFF', 'dark-mode-off'),
    ]),
]

const SideNav = () => {
    const { collapsed, setCollapsed, setBroken, broken } =
        useContext(SidenavContext)
    const [collapsedWidth, setCollapsedWidth] = useState(80)
    const { openCreateGameModal, setOpenJoinGame } = useContext(ModalContext)
    const { setColorStyle } = useContext(CustomThemeContext)
    const navigate = useNavigate()
    const {
        token: { colorBorder },
    } = theme.useToken()

    //brokenHandler
    const onBreakpointHandler = (broken) => {
        if (broken) {
            setCollapsedWidth(0)
            setBroken(true)
        } else {
            setCollapsedWidth(80)
            setBroken(false)
        }
    }

    //menu click handler
    const onMenuClickHandler = async (event) => {
        switch (event.key) {
            case 'dashboard':
                navigate('/dashboard')
                break
            case 'dark-mode-on':
                setColorStyle('dark')
                break
            case 'dark-mode-off':
                setColorStyle('light')
                break
            case 'create-game':
                openCreateGameModal(true, 'p2p')
                break
            case 'join-game':
                setOpenJoinGame(true)
                break
            case 'play-computer':
                openCreateGameModal(true, 'chessbot')
                break
            default:
                break
        }
    }

    return (
        <Sider
            width={'20rem'}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => {
                setCollapsed(value)
            }}
            onBreakpoint={onBreakpointHandler}
            breakpoint="sm"
            trigger={null}
            collapsedWidth={collapsedWidth}
            style={{
                ...styles.sideNavContainer,
                borderRight: `.5px solid ${colorBorder}`,
            }}
            theme="light"
        >
            <div className="demo-logo-vertical" />
            <Menu
                defaultSelectedKeys={['dashboard']}
                defaultOpenKeys={['play']}
                mode="inline"
                items={collapsed ? [...items, ...secondaryItems] : items}
                onClick={onMenuClickHandler}
            />
            <DarkTrigger></DarkTrigger>
            {broken && <MenuTrigger></MenuTrigger>}
        </Sider>
    )
}

export default SideNav

let styles = {
    sideNavContainer: {
        overflow: 'auto',
        height: '100dvh',
    },
}
