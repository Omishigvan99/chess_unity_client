import { Row, Col, Card, Statistic } from 'antd'
import {
    PlayCircleOutlined,
    TrophyOutlined,
    BarChartOutlined,
    FlagOutlined,
} from '@ant-design/icons'

/**
 * PersonalStatsOverview component displays the main statistics cards
 */
function PersonalStatsOverview({ playerStats }) {
    if (!playerStats) return null

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
                <Card>
                    <Statistic
                        title="Total Games"
                        value={playerStats.summary.totalGames}
                        prefix={<PlayCircleOutlined />}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card>
                    <Statistic
                        title="Wins"
                        value={playerStats.summary.wins}
                        prefix={<TrophyOutlined />}
                        valueStyle={{ color: '#3f8600' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card>
                    <Statistic
                        title="Draws"
                        value={playerStats.summary.draws}
                        prefix={<BarChartOutlined />}
                        valueStyle={{ color: '#faad14' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card>
                    <Statistic
                        title="Losses"
                        value={playerStats.summary.losses}
                        prefix={<FlagOutlined />}
                        valueStyle={{ color: '#cf1322' }}
                    />
                </Card>
            </Col>
        </Row>
    )
}

export default PersonalStatsOverview
