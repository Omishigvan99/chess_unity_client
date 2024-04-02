import { useRef } from 'react'
import { Layout, theme } from 'antd'
import { Route, Routes } from 'react-router'
import ArenaView from '../views/Arena.view'

const { Content } = Layout

const MainContainer = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const contentRef = useRef(null)

    return (
        <Content
            ref={contentRef}
            style={{
                position: 'relative',
                backgroundColor: colorBgContainer,
                overflow: 'auto',
                padding: '1rem',
            }}
        >
            <Routes>
                <Route
                    path="/arena/:roomId"
                    element={<ArenaView></ArenaView>}
                ></Route>
            </Routes>
        </Content>
    )
}

export default MainContainer
