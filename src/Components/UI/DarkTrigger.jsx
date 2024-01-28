import { useContext } from 'react'
import { CustomThemeContext } from '../../context/customTheme.context'
import { SidenavContext } from '../../context/sidenav.context'
import { Switch, Typography, Space, Flex, theme } from 'antd'
import { DeploymentUnitOutlined } from '@ant-design/icons'

function DarkTrigger() {
    const { colorStyle, setColorStyle } = useContext(CustomThemeContext)
    const { collapsed } = useContext(SidenavContext)
    const { colorTextLightSolid, padding, colorTextBase } =
        theme.getDesignToken()

    //switch change handler
    const onSwitchChangeHandler = (value) => {
        if (value) {
            setColorStyle('dark')
        } else {
            setColorStyle('light')
        }
    }
    return (
        <>
            {collapsed ? null : (
                <Flex
                    style={{ padding }}
                    gap={'middle'}
                    justify="space-between"
                    align="center"
                >
                    <Space>
                        <DeploymentUnitOutlined
                            style={{
                                color:
                                    colorStyle === 'dark'
                                        ? colorTextLightSolid
                                        : colorTextBase,
                            }}
                        ></DeploymentUnitOutlined>
                        <Typography.Text>Dark Mode</Typography.Text>
                    </Space>
                    <Switch
                        onChange={onSwitchChangeHandler}
                        value={colorStyle === 'dark' ? true : false}
                    ></Switch>
                </Flex>
            )}
        </>
    )
}

export default DarkTrigger
