import { useState, useEffect } from 'react'
import {
    Flex,
    Button,
    Popconfirm,
    Divider,
    Typography,
    Space,
    Slider,
} from 'antd'
import {
    LogoutOutlined,
    LeftSquareOutlined,
    FlagOutlined,
} from '@ant-design/icons'

const ActionsTab = ({
    mode,
    movesList,
    onLeaveRoom = () => {},
    onResign = () => {},
    onRequestDraw = () => {},
    onReset = () => {},
    onDepthChange = () => {},
    stockfishLevel,
}) => {
    return (
        <>
            <Flex gap="small" wrap="wrap">
                <Popconfirm
                    title="Leave the room"
                    description="Are you sure want to leave this game?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={onLeaveRoom}
                >
                    <Button icon={<LeftSquareOutlined />}>Leave</Button>
                </Popconfirm>

                {mode === 'p2p' && (
                    <Popconfirm
                        title="Resign the Game"
                        description="Are you sure want to resign from this game?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={onResign}
                    >
                        <Button icon={<LogoutOutlined />}>Resign</Button>
                    </Popconfirm>
                )}
                {mode === 'p2p' && (
                    <Popconfirm
                        title="Offer Draw"
                        description="Are you sure want to draw this game?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={onRequestDraw}
                    >
                        <Button icon={<FlagOutlined />}>Draw</Button>
                    </Popconfirm>
                )}
                <Popconfirm
                    title="Restart the Game"
                    description="Are you sure want to restart this game?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={onReset}
                >
                    <Button icon={<FlagOutlined />}>Restart</Button>
                </Popconfirm>
            </Flex>
            <Divider />
            {mode === 'chessbot' && (
                <>
                    <Typography.Text>Stockfish Level</Typography.Text>
                    <Slider
                        value={stockfishLevel}
                        onChange={onDepthChange}
                        min={1}
                        max={5}
                        marks={{
                            1: 'Beginner',
                            2: 'Easy',
                            3: 'Medium',
                            4: 'Hard',
                            5: 'Expert',
                        }}
                        step={1}
                    />
                    <Divider />
                </>
            )}
            <Moves movesList={movesList} />
        </>
    )
}

export default ActionsTab

export const Moves = ({ movesList }) => {
    const [pairs, setPairs] = useState([])

    useEffect(() => {
        const newPairs = []
        for (let i = 0; i < movesList.length; i += 2) {
            const pair = movesList.slice(i, i + 2)
            newPairs.push(pair)
        }
        setPairs(newPairs)
    }, [movesList])

    return (
        <div
            style={{
                height: '100%',
                overflow: 'auto',
            }}
        >
            <Space direction="vertical">
                {pairs.map((ply, index) => (
                    <div key={ply + index}>
                        <Space>
                            <Typography.Text
                                style={{
                                    ...styles.moveNumber,
                                }}
                            >
                                {index + 1}
                            </Typography.Text>
                            <Button
                                style={{
                                    ...styles.move,
                                }}
                            >
                                {ply[0]}
                            </Button>
                            {ply[1] && (
                                <Button
                                    block
                                    style={{
                                        ...styles.move,
                                    }}
                                >
                                    {ply[1]}
                                </Button>
                            )}
                        </Space>
                    </div>
                ))}
            </Space>
        </div>
    )
}

const styles = {
    move: {
        width: '5rem',
    },
    moveNumber: {
        display: 'block',
        width: '1rem',
    },
}
