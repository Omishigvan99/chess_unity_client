import { Row, Col, Card, Progress, Space, Statistic } from 'antd'

/**
 * ColorStatistics component displays performance by piece color
 */
function ColorStatistics({ playerStats }) {
    if (!playerStats) return null

    return (
        <Card title="Color Statistics">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                    <Row gutter={[16, 8]} align="middle">
                        <Col xs={8} sm={6}>
                            <Statistic
                                title="Games as White"
                                value={playerStats.gameBreakdown.gamesAsWhite}
                                suffix={`/ ${playerStats.summary.totalGames}`}
                            />
                        </Col>
                        <Col xs={16} sm={18}>
                            <Progress
                                percent={parseFloat(
                                    playerStats.gameBreakdown.whiteWinRate
                                )}
                                size="small"
                                format={(percent) => `${percent}% wins`}
                            />
                        </Col>
                    </Row>
                </div>
                <div>
                    <Row gutter={[16, 8]} align="middle">
                        <Col xs={8} sm={6}>
                            <Statistic
                                title="Games as Black"
                                value={playerStats.gameBreakdown.gamesAsBlack}
                                suffix={`/ ${playerStats.summary.totalGames}`}
                            />
                        </Col>
                        <Col xs={16} sm={18}>
                            <Progress
                                percent={parseFloat(
                                    playerStats.gameBreakdown.blackWinRate
                                )}
                                size="small"
                                strokeColor="#722ed1"
                                format={(percent) => `${percent}% wins`}
                            />
                        </Col>
                    </Row>
                </div>
            </Space>
        </Card>
    )
}

export default ColorStatistics
