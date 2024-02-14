import { Form, Input, Alert, Button, ConfigProvider } from 'antd'
import { useContext } from 'react'
import { ModalContext } from '../../context/modal.context'
import { NotificationContext } from '../../context/notification.context'
import { changePasswordHandler } from '../../utils/auth'

function ChangePasswordForm({ error, setError, form }) {
    const { setOpenChangePassword } = useContext(ModalContext)
    const { openNotification } = useContext(NotificationContext)
    const { componentSize } = ConfigProvider.useConfig()

    // function to check validation
    const checkValidation = async () => {
        try {
            return await form.validateFields()
        } catch (error) {
            throw new (function () {
                this.message = 'Validation Error'
                this.description = 'Please check the form and submit again.'
            })()
        }
    }

    // function to submit the form
    const onSubmitHandler = async () => {
        try {
            const formData = await checkValidation()
            await changePasswordHandler({
                currentPassword: formData.oldpassword,
                newPassword: formData.password1,
                confirmNewPassword: formData.password2,
            })
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
            'Password Change Successful',
            'Password has been changed successfully'
        )

        form.resetFields()
        setOpenChangePassword(false)
    }

    return (
        <Form
            form={form}
            labelAlign="left"
            layout="vertical"
            size={componentSize}
        >
            <Form.Item name="username" hidden>
                <Input
                    aria-hidden={true}
                    autoComplete="username"
                    name="username"
                />
            </Form.Item>
            <Form.Item
                label="Old Password"
                name="oldpassword"
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
            <Form.Item
                label="New Password"
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
                                    'The two passwords that you entered do not match'
                                )
                            )
                        },
                    }),
                ]}
            >
                <Input.Password autoComplete="new-password"></Input.Password>
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={onSubmitHandler}
                >
                    Update
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

export default ChangePasswordForm
