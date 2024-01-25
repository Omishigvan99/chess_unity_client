import { useContext, useState } from 'react'
import { Button, Form, Input, Modal, Alert } from 'antd'
import { ModalContext } from '../../context/modal.context'
import ConfigProvider from 'antd/es/config-provider'
const SignupView = () => {
    const { openSignup, setOpenSignup } = useContext(ModalContext)
    const [isValidationError, setIsValidationError] = useState(false)
    const [form] = Form.useForm()

    const { componentSize } = ConfigProvider.useConfig()

    const onSubmitHandler = async () => {
        try {
            let validationStatus = await form.validateFields()
            console.log(validationStatus)
            // form signup logic
        } catch (error) {
            setIsValidationError(true)
            return
        }
        setOpenSignup(false)
    }
    return (
        <Modal
            open={openSignup}
            onCancel={() => {
                form.resetFields()
                setOpenSignup(false)
            }}
            footer={null}
        >
            <Form form={form} layout="vertical" labelAlign="left">
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
                    <Input placeholder="eg:- John9898" size={componentSize} autoComplete='username'/>
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
                    <Input
                        placeholder="eg:- example@email.com"
                        size={componentSize}
                    />
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
                    <Input.Password
                        size={componentSize}
                        autoComplete="new-password"
                    />
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
                    <Input.Password
                        size={componentSize}
                        autoComplete="new-password"
                    />
                </Form.Item>

                <Form.Item label=" ">
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => onSubmitHandler()}
                        size={componentSize}
                    >
                        Signup
                    </Button>
                </Form.Item>
                {isValidationError ? (
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
                ) : null}
            </Form>
        </Modal>
    )
}
export default SignupView
