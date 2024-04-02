import { Avatar, Badge, Flex, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'

const { Text } = Typography

function Player({ name, rating, imageSrc, isConnected = false }) {
    return (
        <Flex gap="small">
            <Badge dot={isConnected} color="green">
                <Avatar
                    size="large"
                    shape="square"
                    icon={<UserOutlined />}
                    src={imageSrc}
                ></Avatar>
            </Badge>
            <Flex gap={2} vertical>
                <Text>{name}</Text>
                <Text
                    style={{
                        fontSize: '10px',
                    }}
                    type="secondary"
                >
                    {rating}
                </Text>
            </Flex>
        </Flex>
    )
}

export default Player
