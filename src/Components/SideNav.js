import React, { useState } from 'react'
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
const { Sider } = Layout

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

const SideNav = ({ handleMenuClick = () => {} }) => {
    const [collapsed, setCollapsed] = useState(false)

    return (
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
    )
}

export default SideNav
