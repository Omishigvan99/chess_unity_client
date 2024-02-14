import { useContext, useEffect, useState } from 'react'
import {
    Form,
    Divider,
    Input,
    Button,
    Alert,
    Typography,
    ConfigProvider,
    Flex,
    Upload,
    Image,
} from 'antd'
import { GlobalStore } from '../../store/global.store'
import { setUser } from '../../store/auth.store'
import { updateHandler } from '../../utils/auth'
import { NotificationContext } from '../../context/notification.context'
import { ModalContext } from '../../context/modal.context'
import { uploadProfileImage } from '../../utils/profile'

function UpdateForm() {
    const [form] = Form.useForm()
    const [authState, dispatch] = useContext(GlobalStore).auth
    const { openNotification } = useContext(NotificationContext)
    const { setOpenChangePassword } = useContext(ModalContext)
    const [error, setError] = useState({
        isError: false,
        message: null,
        description: null,
    })
    const { componentSize } = ConfigProvider.useConfig()

    //effects to set the form values
    useEffect(() => {
        form.setFieldsValue({
            name: authState.name,
            email: authState.email,
        })
    }, [authState])

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
    async function onSubmitHandler() {
        try {
            const formData = await checkValidation()
            const responseData = await updateHandler({
                name: formData.name,
                email: formData.email,
            })

            dispatch(
                setUser({
                    name: responseData.data.name,
                    email: responseData.data.email,
                })
            )
        } catch (error) {
            setError({
                isError: true,
                message: error?.message || 'Unknow Error',
                description:
                    error?.description ||
                    'Something went wrong while updating profile',
            })
            return
        }
        openNotification('success', 'Update Successful', 'Profile updated')
    }

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                labelAlign="left"
                size={componentSize}
            >
                <Flex vertical={true} gap={16}>
                    <Image
                        src={
                            authState.avatar
                                ? authState.avatar
                                : 'https://via.placeholder.com/150'
                        }
                        alt="Profile Picture"
                        width={150}
                        height={150}
                    ></Image>
                    <Upload
                        listType="picture"
                        maxCount={1}
                        id="avatar"
                        customRequest={async ({ file, onSuccess, onError }) => {
                            try {
                                const responseData = await uploadProfileImage({
                                    file,
                                })
                                dispatch(
                                    setUser({
                                        avatar: responseData.data.avatar,
                                    })
                                )
                                onSuccess(responseData, file)
                            } catch (error) {
                                console.log(error)
                                onError(error)
                            }
                        }}
                    >
                        <Button>Upload</Button>
                    </Upload>
                </Flex>
                <Divider></Divider>
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
                    <Input
                        placeholder="eg:- John Doe"
                        autoComplete="name"
                    ></Input>
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
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={onSubmitHandler}
                    >
                        Update
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
                <Divider></Divider>
                <Form.Item>
                    <Typography.Link
                        onClick={() => {
                            setOpenChangePassword(true)
                        }}
                    >
                        Change password
                    </Typography.Link>
                </Form.Item>
            </Form>
        </>
    )
}

export default UpdateForm
