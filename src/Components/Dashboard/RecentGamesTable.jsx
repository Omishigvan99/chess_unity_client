import { Card, Table, Tag, Space, Avatar, Typography } from 'antd'
import {
    ClockCircleOutlined,
    TrophyOutlined,
    UserOutlined,
    FlagOutlined,
    BarChartOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons'

const { Text } = Typography

/**
 * RecentGamesTable component displays the recent games history
 */
function RecentGamesTable({ playerStats }) {
    if (!playerStats || !playerStats.recentGames) return null

    const getResultColor = (result) => {
        switch (result) {
            case 'win':
                return 'success'
            case 'loss':
                return 'error'
            case 'draw':
                return 'warning'
            default:
                return 'default'
        }
    }

    const getResultIcon = (result) => {
        switch (result) {
            case 'win':
                return <TrophyOutlined />
            case 'loss':
                return <FlagOutlined />
            case 'draw':
                return <BarChartOutlined />
            default:
                return <PlayCircleOutlined />
        }
    }

    const recentGamesColumns = [
        {
            title: 'Opponent',
            dataIndex: 'opponent',
            key: 'opponent',
            render: (opponent) => (
                <Space>
                    <Avatar
                        size="small"
                        icon={<UserOutlined />}
                        src={opponent.avatar}
                    />
                    <Text>{opponent.name}</Text>
                </Space>
            ),
        },
        {
            title: 'Color',
            dataIndex: 'playerColor',
            key: 'playerColor',
            render: (color) => (
                <Tag color={color === 'white' ? 'default' : 'purple'}>
                    {color.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Result',
            dataIndex: 'result',
            key: 'result',
            render: (result, record) => (
                <Tag
                    color={getResultColor(result)}
                    icon={getResultIcon(result)}
                >
                    {result.toUpperCase()}
                    {record.winReason && ` (${record.winReason})`}
                    {record.drawReason && ` (${record.drawReason})`}
                </Tag>
            ),
        },
        {
            title: 'Moves',
            dataIndex: 'movesCount',
            key: 'movesCount',
            render: (count) => <Text type="secondary">{count}</Text>,
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <Text type="secondary">
                    {new Date(date).toLocaleDateString()}
                </Text>
            ),
        },
    ]

    return (
        <Card
            title={
                <Space>
                    <ClockCircleOutlined />
                    Recent Game History
                </Space>
            }
        >
            <Table
                dataSource={playerStats.recentGames}
                columns={recentGamesColumns}
                rowKey="id"
                pagination={{ pageSize: 5, showSizeChanger: false }}
                size="small"
            />
        </Card>
    )
}

export default RecentGamesTable
