import { Row, Col, Spin, Alert } from 'antd'

/**
 * LoadingAndErrorStates component handles loading and authentication states
 */
function LoadingAndErrorStates({ loading, isAuthenticated }) {
    if (!isAuthenticated) {
        return (
            <Row justify="center" style={{ marginTop: '50px' }}>
                <Col span={12}>
                    <Alert
                        message="Authentication Required"
                        description="Please log in to view your dashboard statistics."
                        type="warning"
                        showIcon
                    />
                </Col>
            </Row>
        )
    }

    if (loading) {
        return (
            <Row justify="center" style={{ marginTop: '100px' }}>
                <Col>
                    <Spin size="large" />
                </Col>
            </Row>
        )
    }

    return null
}

export default LoadingAndErrorStates
