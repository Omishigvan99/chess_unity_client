import {
    Row,
    Col,
    Card,
    Statistic,
    Table,
    List,
    Tag,
    Space,
    Avatar,
    Typography,
} from 'antd'
import { PlayCircleOutlined, UserOutlined } from '@ant-design/icons'

const { Text } = Typography

/**
 * GlobalStatistics component displays platform-wide statistics
 */
function GlobalStatistics({ globalStats }) {
    if (!globalStats) return null

    const mostActivePlayersColumns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            render: (_, __, index) => <Text strong>{index + 1}</Text>,
        },
        {
            title: 'Player',
            dataIndex: 'name',
            key: 'name',
            render: (name) => (
                <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <Text>{name}</Text>
                </Space>
            ),
        },
        {
            title: 'Games Played',
            dataIndex: 'gamesPlayed',
            key: 'gamesPlayed',
            render: (games) => (
                <Tag color="blue" icon={<PlayCircleOutlined />}>
                    {games}
                </Tag>
            ),
        },
    ]

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card>
                        <Statistic
                            title="Total Games Played"
                            value={globalStats.totalGames}
                            prefix={<PlayCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card>
                        <Statistic
                            title="P2P Games"
                            value={globalStats.gamesByType.p2p || 0}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card>
                        <Statistic
                            title="Bot Games"
                            value={globalStats.gamesByType.bot || 0}
                            prefix={<PlayCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={24} md={12}>
                    <Card title="Most Active Players">
                        <Table
                            dataSource={globalStats.mostActivePlayers}
                            columns={mostActivePlayersColumns}
                            rowKey="_id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Latest Games">
                        <List
                            itemLayout="horizontal"
                            dataSource={globalStats.recentGames.slice(0, 5)}
                            renderItem={(game) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                icon={<PlayCircleOutlined />}
                                            />
                                        }
                                        title={
                                            <Space>
                                                <Text>
                                                    {game.players.white.name}
                                                </Text>
                                                <Text type="secondary">vs</Text>
                                                <Text>
                                                    {game.players.black.name}
                                                </Text>
                                            </Space>
                                        }
                                        description={
                                            <Space>
                                                <Tag
                                                    color={
                                                        game.winner
                                                            ? 'success'
                                                            : 'warning'
                                                    }
                                                >
                                                    {game.winner
                                                        ? `${game.winner} wins`
                                                        : 'Draw'}
                                                </Tag>
                                                <Text type="secondary">
                                                    {new Date(
                                                        game.createdAt
                                                    ).toLocaleDateString()}
                                                </Text>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default GlobalStatistics
