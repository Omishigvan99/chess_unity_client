import { useContext } from 'react'
import {
    Form,
    Input,
    Button,
    Alert,
    ConfigProvider,
} from 'antd'
import { signupHandler } from '../../utils/auth'
import { NotificationContext } from '../../context/notification.context'
import { ModalContext } from '../../context/modal.context'

function SignupForm({ error, setError, form }) {
    const { setOpenSignup } = useContext(ModalContext)
    const { openNotification } = useContext(NotificationContext)
    const { componentSize } = ConfigProvider.useConfig()

     // function to check validation
     async function checkValidation() {
        try {
            return await form.validateFields()
        } catch {
            throw new Error('Validation Error')
        }
    }

    // function to submit the form
    async function onSubmitHandler() {
        try {
            const formData = await checkValidation()
            await signupHandler({
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password1,
            })
        } catch (error) {
            switch (error.message) {
                case 'Validation Error':
                    setError({
                        isError: true,
                        message: 'Validation Error',
                        description: 'Please check the form and submit again.',
                    })
                    break
                case 'Registration Error':
                    setError({
                        isError: true,
                        message: 'Registration Error',
                        description: 'Username or Email already exists',
                    })
                    break
                default:
                    setError({
                        isError: true,
                        message: 'Unkown Error',
                        description:
                            'Unknown Error has occurred there is nothing wrong from your side',
                    })
                    break
            }
            return
        }
        openNotification(
            'success',
            'Signup Successful',
            'You have been signed up successfully'
        )
        setOpenSignup(false)
    }

    return (
        <Form
            form={form}
            layout="vertical"
            labelAlign="left"
            size={componentSize}
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[
                    {
                        required: true,
                        max: 50,
                        min: 3,
                    },
                ]}
            >
                <Input placeholder="eg:- John Doe" autoComplete="name"></Input>
            </Form.Item>
            <Form.Item
                label="Username"
                name="username"
                rules={[
                    {
                        required: true,
                        max: 50,
                        min: 3,
                    },
                ]}
            >
                <Input placeholder="eg:- John9898" autoComplete="username" />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                        required: true,
                        max: 50,
                        min: 3,
                        type: 'email',
                    },
                ]}
            >
                <Input placeholder="eg:- example@email.com" />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password1"
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
                <Input.Password autoComplete="new-password" />
            </Form.Item>

            <Form.Item
                label="Confirm Password"
                name="password2"
                dependencies={['password1']}
                rules={[
                    {
                        required: true,
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (
                                !value ||
                                getFieldValue('password1') === value
                            ) {
                                return Promise.resolve()
                            }
                            return Promise.reject(
                                new Error(
                                    'The two passwords that you entered do not match!'
                                )
                            )
                        },
                    }),
                ]}
            >
                <Input.Password autoComplete="new-password" />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => onSubmitHandler()}
                >
                    Signup
                </Button>
            </Form.Item>
            {error.isError ? (
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
            ) : null}
        </Form>
    )
}

export default SignupForm
