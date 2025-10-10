import React from 'react'
import { Spin, Typography, Progress, Card, Space } from 'antd'
import {
    DatabaseOutlined,
    CloudServerOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

const ServerLoadingPage = ({
    isLoading = true,
    serverStatus = null,
    retryCount = 0,
    maxRetries = 30,
    error = null,
}) => {
    const getProgressPercent = () => {
        if (error) return 0
        if (!isLoading && serverStatus?.status === 'ok') return 100
        return Math.min(((retryCount + 1) / maxRetries) * 100, 95)
    }

    const getStatusColor = () => {
        if (error) return '#ff4d4f'
        if (!isLoading && serverStatus?.status === 'ok') return '#52c41a'
        return '#1890ff'
    }

    const getStatusText = () => {
        if (error) return 'Connection Failed'
        if (!isLoading && serverStatus?.status === 'ok') return 'Server Ready!'
        if (retryCount === 0) return 'Initializing server...'
        if (retryCount < 10) return 'Starting server instance...'
        if (retryCount < 20) return 'Loading services...'
        return 'Almost ready...'
    }

    const renderServiceStatus = (serviceName, status) => {
        const getServiceIcon = () => {
            const iconStyle = {
                color: status === 'connected' ? '#52c41a' : '#d9d9d9',
            }
            switch (serviceName) {
                case 'database':
                    return <DatabaseOutlined style={iconStyle} />
                case 'redis':
                    return <CloudServerOutlined style={iconStyle} />
                default:
                    return status === 'connected' ? (
                        <CheckCircleOutlined style={iconStyle} />
                    ) : (
                        <LoadingOutlined style={iconStyle} />
                    )
            }
        }

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {getServiceIcon()}
                <Text style={{ textTransform: 'capitalize' }}>
                    {serviceName}:{' '}
                    {status === 'connected' ? 'Ready' : 'Connecting...'}
                </Text>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <div style={styles.loadingCard}>
                <Card style={styles.card} bordered={false}>
                    <Space
                        direction="vertical"
                        size="large"
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        {/* Main loading spinner */}
                        <div>
                            <Spin
                                size="large"
                                spinning={isLoading && !error}
                                style={{ fontSize: '48px' }}
                            />
                        </div>

                        {/* Title */}
                        <Title
                            level={2}
                            style={{ margin: 0, color: getStatusColor() }}
                        >
                            Chess Unity
                        </Title>

                        {/* Status text */}
                        <Text
                            style={{
                                fontSize: '16px',
                                color: getStatusColor(),
                                fontWeight: 500,
                            }}
                        >
                            {getStatusText()}
                        </Text>

                        {/* Progress bar */}
                        <Progress
                            percent={getProgressPercent()}
                            status={
                                error
                                    ? 'exception'
                                    : isLoading
                                    ? 'active'
                                    : 'success'
                            }
                            strokeColor={getStatusColor()}
                            showInfo={false}
                            style={{ marginBottom: '16px' }}
                        />

                        {/* Server info */}
                        {serverStatus && (
                            <div style={styles.serverInfo}>
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: '12px',
                                        marginBottom: '8px',
                                        display: 'block',
                                    }}
                                >
                                    Server Status
                                </Text>

                                {serverStatus.services && (
                                    <Space direction="vertical" size="small">
                                        {Object.entries(
                                            serverStatus.services
                                        ).map(([service, status]) =>
                                            renderServiceStatus(service, status)
                                        )}
                                    </Space>
                                )}

                                {serverStatus.uptime && (
                                    <Text
                                        type="secondary"
                                        style={{
                                            fontSize: '12px',
                                            marginTop: '8px',
                                            display: 'block',
                                        }}
                                    >
                                        Uptime: {serverStatus.uptime.readable}
                                    </Text>
                                )}
                            </div>
                        )}

                        {/* Error message */}
                        {error && (
                            <div style={styles.errorMessage}>
                                <Text type="danger">
                                    Unable to connect to server. Please check
                                    your connection and try again.
                                </Text>
                                <br />
                                <Text
                                    type="secondary"
                                    style={{ fontSize: '12px' }}
                                >
                                    This may take a moment if the server is
                                    starting up for the first time.
                                </Text>
                            </div>
                        )}

                        {/* Render info for onrender.com */}
                        {retryCount > 5 && !error && (
                            <Text
                                type="secondary"
                                style={{
                                    fontSize: '12px',
                                    fontStyle: 'italic',
                                }}
                            >
                                Server is starting up... This may take up to 2
                                minutes on first load.
                            </Text>
                        )}
                    </Space>
                </Card>
            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
    },
    loadingCard: {
        width: '100%',
        maxWidth: '400px',
    },
    card: {
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
    },
    serverInfo: {
        textAlign: 'left',
        width: '100%',
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
    },
    errorMessage: {
        textAlign: 'center',
        padding: '12px',
        background: '#fff2f0',
        borderRadius: '8px',
        border: '1px solid #ffccc7',
    },
}

export default ServerLoadingPage
