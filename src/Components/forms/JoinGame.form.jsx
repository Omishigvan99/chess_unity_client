import { Form, Input, Button, Alert } from 'antd'
import { useContext, useState } from 'react'
import { ModalContext } from '../../context/modal.context'
import { useNavigate } from 'react-router'
import { getRoomDetails } from '../../utils/rooms'
import { useSocket } from '../../hooks/useSocket'
import { useAuthReducer } from '../../store/auth.store'
import { GlobalStore } from '../../store/global.store'

function JoinGameForm() {
    const [form] = Form.useForm()
    const [auth] = useContext(GlobalStore).auth
    const { setOpenJoinGame } = useContext(ModalContext)
    const [error, setError] = useState({
        isError: false,
        message: '',
    })
    const navigate = useNavigate()
    const socket = useSocket('/p2p')

    // function to check validation
    const checkValidation = async () => {
        try {
            let formData = await form.validateFields()
            return formData
        } catch {
            throw new (function () {
                this.message = 'Validation Error'
                this.description = 'Please check the form and submit again.'
            })()
        }
    }

    // handler to join the game
    const onJoinGameHandler = async () => {
        console.log('Join Game')
        try {
            const formData = await checkValidation()
            if (
                /^((http(s)?:\/\/)?(www\.)?(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))|((http(s)?:\/\/)?(localhost|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:\d{2,5})?)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(
                    formData['user-code']
                )
            ) {
                const code = formData['user-code'].split('/').pop()
                await getRoomDetails(socket, {
                    roomId: code,
                    isGuest: !auth.isAuthenticated,
                })
                navigate(`/arena/${code}`)
            } else {
                const code = formData['user-code']
                await getRoomDetails(socket, {
                    roomId: code,
                    isGuest: !auth.isAuthenticated,
                })
                navigate(`/arena/${code}`)
            }
        } catch (error) {
            setError({
                isError: true,
                message: error?.message || 'Unknow Error',
                description:
                    error?.description ||
                    'Something went wrong while joining game',
            })
            return
        }

        form.resetFields()
        setOpenJoinGame(false)
    }

    return (
        <Form form={form} layout="vertical">
            <Form.Item
                label="Enter Code or URL"
                name="user-code"
                rules={[
                    {
                        required: true,
                        message: 'Please enter a code or URL',
                    },
                ]}
            >
                <Input type="text" placeholder="Enter Game URL or Code"></Input>
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={onJoinGameHandler}
                >
                    Join Game
                </Button>
            </Form.Item>
            {error.isError && (
                <Alert
                    message={error.message}
                    description={error.description}
                    type="error"
                    showIcon
                    closable
                    onClose={() => {
                        setError({
                            isError: false,
                            message: null,
                            description: null,
                        })
                    }}
                />
            )}
        </Form>
    )
}

export default JoinGameForm
