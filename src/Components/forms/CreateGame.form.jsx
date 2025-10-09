import {
    Form,
    Input,
    Button,
    Space,
    Card,
    Image,
    theme,
    Slider,
    Typography,
} from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ModalContext } from '../../context/modal.context'
import { P2P_URL } from '../../constants/URL'

const { Text } = Typography

function CreateGameForm({ link, roomId, showStockfishLevel = false }) {
    const [form] = Form.useForm()
    const { setOpenCreateGame } = useContext(ModalContext)
    const [selectedPiece, setSelectedPiece] = useState(3)
    const [stockfishLevel, setStockfishLevel] = useState(3)
    const [isCopied, setIsCopied] = useState(false)
    const {
        token: { colorPrimaryHover },
    } = theme.useToken()
    const navigate = useNavigate()

    // useEffect to reset the isCopied state
    useEffect(() => {
        if (isCopied) {
            setTimeout(() => {
                setIsCopied(false)
            }, 10000)
        }
    }, [isCopied])

    // handler to set the selected piece
    const onPieceChoiceHandler = useCallback((option) => {
        setSelectedPiece(option)
    }, [])

    // copy handler
    const onCopyHandler = useCallback((text) => {
        navigator.clipboard.writeText(text)
        setIsCopied(true)
    }, [])

    // form submit handler
    const onStartGameHandler = () => {
        if (!roomId) return
        const color = (() => {
            switch (selectedPiece) {
                case 1:
                    return 'black'
                case 2:
                    return 'white'
                case 3:
                    return Math.random() > 0.5 ? 'black' : 'white'
                default:
                    return Math.random() > 0.5 ? 'black' : 'white'
            }
        })()

        // Extract the pathname from complete URL for internal routing
        try {
            const url = new URL(link)
            const internalPath = `${url.pathname}${
                url.search ? url.search + '&' : '?'
            }color=${color}${
                showStockfishLevel ? `&level=${stockfishLevel}` : ''
            }`
            navigate(internalPath)
        } catch (error) {
            // If link is already a relative path, use it directly
            navigate(
                `${link}?color=${color}${
                    showStockfishLevel ? `&level=${stockfishLevel}` : ''
                }`
            )
        }

        form.resetFields()
        setIsCopied(false)
        setOpenCreateGame(false)
    }

    return (
        <Form form={form} layout="vertical">
            <Form.Item label="Arena Link" name="link">
                <Space.Compact style={styles.input}>
                    <Input type="text" disabled={true} value={link}></Input>
                    <Button
                        icon={<CopyOutlined />}
                        onClick={() => {
                            onCopyHandler(link)
                        }}
                        disabled={isCopied}
                    ></Button>
                </Space.Compact>
            </Form.Item>
            <Form.Item label="Arena Code" name="room-id">
                <Space.Compact style={styles.input}>
                    <Input type="text" disabled={true} value={roomId}></Input>
                    <Button
                        icon={<CopyOutlined />}
                        onClick={() => {
                            onCopyHandler(roomId)
                        }}
                        disabled={isCopied}
                    ></Button>
                </Space.Compact>
            </Form.Item>

            <Form.Item label="Select Piece" name={'select-piece'}>
                <Space>
                    <Card
                        size="small"
                        style={{
                            backgroundColor:
                                selectedPiece === 1 ? colorPrimaryHover : null,
                        }}
                        onClick={() => onPieceChoiceHandler(1)}
                    >
                        <Image
                            style={styles.image}
                            src="/defaultPieces/b-queen.svg"
                            preview={false}
                        ></Image>
                    </Card>
                    <Card
                        size="small"
                        style={{
                            backgroundColor:
                                selectedPiece === 2 ? colorPrimaryHover : null,
                        }}
                        onClick={() => onPieceChoiceHandler(2)}
                    >
                        <Image
                            style={styles.image}
                            src="/defaultPieces/w-queen.svg"
                            preview={false}
                        ></Image>
                    </Card>
                    <Card
                        size="small"
                        style={{
                            backgroundColor:
                                selectedPiece === 3 ? colorPrimaryHover : null,
                        }}
                        onClick={() => onPieceChoiceHandler(3)}
                    >
                        <Image
                            style={styles.image}
                            src="/defaultPieces/b-w-queen.svg"
                            preview={false}
                        ></Image>
                    </Card>
                </Space>
            </Form.Item>

            {showStockfishLevel && (
                <Form.Item label="Stockfish Level" name="stockfish-level">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Slider
                            min={1}
                            max={5}
                            value={stockfishLevel}
                            onChange={setStockfishLevel}
                            marks={{
                                1: 'Beginner',
                                2: 'Easy',
                                3: 'Medium',
                                4: 'Hard',
                                5: 'Expert',
                            }}
                            step={1}
                        />
                        <Text type="secondary">
                            Current Level: {stockfishLevel} -{' '}
                            {stockfishLevel === 1
                                ? 'Beginner'
                                : stockfishLevel === 2
                                ? 'Easy'
                                : stockfishLevel === 3
                                ? 'Medium'
                                : stockfishLevel === 4
                                ? 'Hard'
                                : 'Expert'}
                        </Text>
                    </Space>
                </Form.Item>
            )}

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={onStartGameHandler}
                >
                    Start Game
                </Button>
            </Form.Item>
        </Form>
    )
}

const styles = {
    image: {
        height: '5rem',
    },
    input: {
        width: '100%',
    },
}

export default CreateGameForm
