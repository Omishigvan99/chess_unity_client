import { Row, Col, Card, Statistic } from 'antd'
import { TrophyOutlined, FlagOutlined } from '@ant-design/icons'

/**
 * AchievementStats component displays achievements and streaks
 */
function AchievementStats({ playerStats }) {
    if (!playerStats) return null

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
                <Card>
                    <Statistic
                        title="Longest Win Streak"
                        value={playerStats.summary.longestWinStreak}
                        prefix={<TrophyOutlined />}
                        valueStyle={{ color: '#faad14' }}
                    />
                </Card>
            </Col>
            <Col xs={24} md={8}>
                <Card>
                    <Statistic
                        title="Wins by Checkmate"
                        value={playerStats.winReasons.checkmate}
                        prefix={<TrophyOutlined />}
                    />
                </Card>
            </Col>
            <Col xs={24} md={8}>
                <Card>
                    <Statistic
                        title="Wins by Resignation"
                        value={playerStats.winReasons.resignation}
                        prefix={<FlagOutlined />}
                    />
                </Card>
            </Col>
        </Row>
    )
}

export default AchievementStats
