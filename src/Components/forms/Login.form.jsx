import { useContext } from 'react'
import { Form, Input, Button, Alert, ConfigProvider } from 'antd'
import { setUser } from '../../store/auth.store'
import { GlobalStore } from '../../store/global.store'
import { loginHandler } from '../../utils/auth'
import { NotificationContext } from '../../context/notification.context'
import { ModalContext } from '../../context/modal.context'

function LoginForm({ form, error, setError }) {
    const [authState, dispatch] = useContext(GlobalStore).auth
    const { openNotification } = useContext(NotificationContext)
    const { setOpenLogin } = useContext(ModalContext)
    const { componentSize } = ConfigProvider.useConfig()

    // function to check validation
    async function checkValidation() {
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

    // function to submit the form
    const onSubmitHandler = async (e) => {
        try {
            const formData = await checkValidation()
            const responseData = await loginHandler({
                email: formData['username/email'],
                username: formData['username/email'],
                password: formData.password,
            })
            // dispatching the login action
            dispatch(
                setUser({
                    id: responseData.data.user._id,
                    username: responseData.data.user.username,
                    email: responseData.data.user.email,
                    name: responseData.data.user.name,
                    avatar: responseData.data.user.avatar
                        ? responseData.data.user.avatar.url
                        : null,
                    accessToken: responseData.data.accessToken,
                    refreshToken: responseData.data.refreshToken,
                })
            )
        } catch (error) {
            setError({
                isError: true,
                message: error?.message || 'Unknow Error',
                description:
                    error?.description || 'Something went wrong while login in',
            })
            return
        }

        openNotification(
            'success',
            'Login Successful',
            'You have been successfully logged in..'
        )

        form.resetFields()
        setOpenLogin(false)
    }
    return (
        <Form
            form={form}
            labelAlign="left"
            layout="vertical"
            size={componentSize}
        >
            <Form.Item
                label="Username or Email"
                name="username/email"
                rules={[
                    {
                        required: true,
                        max: 50,
                        message:
                            'Username or Email must be less than 50 chars long',
                    },
                ]}
            >
                <Input
                    type="text"
                    placeholder="eg:- example@email.com or JonDoe99"
                    autoComplete="username"
                />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        pattern:
                            '^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,30}$',
                        message:
                            'Password must contain at least one number, one uppercase and lowercase letter, one Symbol out of [!@#$%^&*], and minimum 8 and maximum 30 characters',
                    },
                ]}
            >
                <Input.Password autoComplete="current-password" />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={(e) => onSubmitHandler(e)}
                >
                    Login
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

export default LoginForm
