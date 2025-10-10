import { Row, Col, Card, Progress, Space, Typography } from 'antd'

const { Text } = Typography

/**
 * PerformanceOverview component displays win/draw/loss rates
 */
function PerformanceOverview({ playerStats }) {
    if (!playerStats) return null

    return (
        <Card title="Performance Overview">
            <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                    <Text>Win Rate</Text>
                    <Progress
                        percent={playerStats.summary.winRate}
                        strokeColor="#52c41a"
                        format={(percent) => `${percent}%`}
                    />
                </div>
                <div>
                    <Text>Draw Rate</Text>
                    <Progress
                        percent={playerStats.summary.drawRate}
                        strokeColor="#faad14"
                        format={(percent) => `${percent}%`}
                    />
                </div>
                <div>
                    <Text>Loss Rate</Text>
                    <Progress
                        percent={playerStats.summary.lossRate}
                        strokeColor="#ff4d4f"
                        format={(percent) => `${percent}%`}
                    />
                </div>
            </Space>
        </Card>
    )
}

export default PerformanceOverview
