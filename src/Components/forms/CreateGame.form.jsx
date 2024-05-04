import { Form, Input, Button, Space, Card, Image, theme } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ModalContext } from '../../context/modal.context'
import { P2P_URL } from '../../constants/URL'

function CreateGameForm({ link, roomId }) {
    const [form] = Form.useForm()
    const { setOpenCreateGame } = useContext(ModalContext)
    const [selectedPiece, setSelectedPiece] = useState(3)
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
    const onPieceChoiceHandler = (option) => {
        setSelectedPiece(option)
    }

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
        navigate(`${P2P_URL}/${roomId}?color=${color}`)
        form.resetFields()
        setIsCopied(false)
        setOpenCreateGame(false)
    }

    // copy handler
    const onCopyHandler = (text) => {
        navigator.clipboard.writeText(text)
        setIsCopied(true)
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
