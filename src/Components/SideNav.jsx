import { useContext, useState } from 'react'
import { DesktopOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd'
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
    getItem('Play', 'play', <DesktopOutlined />, [
        getItem('Play with computer', 'play-computer'),
        getItem('Play with a friend', 'play-friend', null, [
            getItem('Create Game', 'create-game'),
            getItem('Join Game', 'join-game'),
        ]),
        getItem('Quick Game', 'quick-game'),
    ]),
    getItem('Puzzles', 'puzzel', <UserOutlined />, [
        getItem('Solve Puzzle', 'puzzel-solve'),
        getItem('Create Puzzle', 'puzzel-create'),
    ]),
    getItem('Tournaments', 'tournament', <TeamOutlined />, [
        getItem('Play Tournament', 'tournament-play'),
        getItem('Host Tournament', 'tournament-host'),
        getItem('Watch Games', 'tournament-watch'),
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
    const { setOpenCreateGame, setOpenJoinGame } = useContext(ModalContext)
    const { setColorStyle } = useContext(CustomThemeContext)
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
    const onMenuClickHandler = (event) => {
        switch (event.key) {
            case 'dark-mode-on':
                setColorStyle('dark')
                break
            case 'dark-mode-off':
                setColorStyle('light')
                break
            case 'create-game':
                setOpenCreateGame(true)
                break
            case 'join-game':
                setOpenJoinGame(true)
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
                defaultSelectedKeys={['play-computer']}
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
