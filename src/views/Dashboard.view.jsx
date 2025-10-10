import { useContext, useEffect, useState } from 'react'
import { Row, Col, Space, Divider } from 'antd'
import { GlobalStore } from '../store/global.store'
import { MessageContext } from '../context/message.context'
import { getPlayerStats, getGlobalStats } from '../utils/stats'

// Dashboard Components
import {
    LoadingAndErrorStates,
    DashboardHeader,
    PersonalStatsOverview,
    PerformanceOverview,
    ColorStatistics,
    AchievementStats,
    RecentGamesTable,
    GlobalStatistics,
} from '../Components/Dashboard'

/**
 * Dashboard component displays comprehensive game statistics for the player
 */
function DashboardView() {
    const [auth] = useContext(GlobalStore).auth
    const { error } = useContext(MessageContext)
    const [playerStats, setPlayerStats] = useState(null)
    const [globalStats, setGlobalStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchStats()
        }
    }, [auth.isAuthenticated])

    const fetchStats = async () => {
        try {
            setLoading(true)
            const [playerData, globalData] = await Promise.all([
                getPlayerStats(auth.id),
                getGlobalStats(),
            ])
            setPlayerStats(playerData.data)
            setGlobalStats(globalData.data)
        } catch (err) {
            console.error('Error fetching stats:', err)
            error('Failed to load statistics')
        } finally {
            setLoading(false)
        }
    }

    // Show loading or error states
    const loadingOrErrorComponent = (
        <LoadingAndErrorStates
            loading={loading}
            isAuthenticated={auth.isAuthenticated}
        />
    )

    if (!auth.isAuthenticated || loading) {
        return loadingOrErrorComponent
    }

    return (
        <Space
            direction="vertical"
            size="large"
            style={{ width: '100%', padding: '24px' }}
        >
            {/* Header */}
            <DashboardHeader userName={auth.name} />

            {/* Personal Statistics Overview */}
            {playerStats && (
                <>
                    <Divider orientation="left">Personal Statistics</Divider>
                    <PersonalStatsOverview playerStats={playerStats} />

                    {/* Win Rate and Performance */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <PerformanceOverview playerStats={playerStats} />
                        </Col>
                        <Col xs={24} md={12}>
                            <ColorStatistics playerStats={playerStats} />
                        </Col>
                    </Row>

                    {/* Achievement and Streaks */}
                    <AchievementStats playerStats={playerStats} />

                    {/* Recent Games */}
                    <Divider orientation="left">Recent Games</Divider>
                    <RecentGamesTable playerStats={playerStats} />
                </>
            )}

            {/* Global Statistics */}
            {globalStats && (
                <>
                    <Divider orientation="left">Global Statistics</Divider>
                    <GlobalStatistics globalStats={globalStats} />
                </>
            )}
        </Space>
    )
}

export default DashboardView
