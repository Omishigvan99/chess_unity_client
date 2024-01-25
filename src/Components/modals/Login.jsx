import { useState, useContext } from 'react'
import { Alert, Button, ConfigProvider, Form, Input, Modal } from 'antd'
import { ModalContext } from '../../context/modal.context'
const Login = () => {
    const { openLogin, setOpenLogin } = useContext(ModalContext)
    const [isValidationError, setIsValidationError] = useState(false)
    const [form] = Form.useForm()

    const { componentSize } = ConfigProvider.useConfig()

    const onSubmitHandler = async (e) => {
        try {
            let validationStatus = await form.validateFields()
            console.log(validationStatus)
            // form login logic
        } catch (error) {
            setIsValidationError(true)
            return
        }

        setOpenLogin(false)
    }

    return (
        <Modal
            open={openLogin}
            footer={null}
            onCancel={() => {
                form.resetFields()
                setOpenLogin(false)
            }}
        >
            <Form form={form} labelAlign="left" layout="vertical">
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
                        size={componentSize}
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
                    <Input.Password
                        size={componentSize}
                        autoComplete="current-password"
                    />
                </Form.Item>

                <Form.Item label=" ">
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={(e) => onSubmitHandler(e)}
                        size={componentSize}
                    >
                        Login
                    </Button>
                </Form.Item>
                {isValidationError && (
                    <Alert
                        message="Validation Error"
                        description="Please check the form and submit again."
                        type="error"
                        showIcon
                        closable
                        onClose={() => {
                            setIsValidationError(false)
                        }}
                    />
                )}
            </Form>
        </Modal>
    )
}
export default Login
