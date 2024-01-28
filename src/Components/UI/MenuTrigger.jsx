import { useContext } from 'react'
import { SidenavContext } from '../../context/sidenav.context'
import { theme, Card } from 'antd'
import { LeftOutlined } from '@ant-design/icons'

function MenuTrigger() {
    const { setCollapsed, collapsed } = useContext(SidenavContext)
    const {
        token: { colorPrimaryBg },
    } = theme.useToken()
    return (
        <Card
            style={{
                backgroundColor: colorPrimaryBg,
                ...styles.triggerContainer,
            }}
            onClick={() => {
                setCollapsed(!collapsed)
            }}
        >
            <LeftOutlined />
        </Card>
    )
}

export default MenuTrigger

const styles = {
    triggerContainer: {
        position: 'sticky',
        bottom: 0,
        textAlign: 'center',
        borderRadius: 0,
    },
}
