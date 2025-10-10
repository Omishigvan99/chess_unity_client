import { Row, Col, Typography } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

/**
 * DashboardHeader component displays the dashboard title and welcome message
 */
function DashboardHeader({ userName }) {
    return (
        <Row>
            <Col span={24}>
                <Title level={2}>
                    <BarChartOutlined /> Dashboard
                </Title>
                <Text type="secondary">
                    Welcome back, {userName}! Here's your chess statistics
                    overview.
                </Text>
            </Col>
        </Row>
    )
}

export default DashboardHeader
