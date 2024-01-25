import { useContext } from 'react'
import { CustomThemeContext } from '../../context/customTheme.context'
import { SidenavContext } from '../../context/sidenav.context'
import { theme, Card } from 'antd'
import { globalColors } from '../../constants/colors'
import { LeftOutlined } from '@ant-design/icons'

function MenuTrigger() {
    const { colorStyle } = useContext(CustomThemeContext)
    const { setCollapsed, collapsed } = useContext(SidenavContext)
    const { colorPrimaryBg } = theme.getDesignToken()
    return (
        <Card
            style={{
                backgroundColor:
                    colorStyle === 'dark'
                        ? globalColors.grey['grey-7']
                        : colorPrimaryBg,
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
