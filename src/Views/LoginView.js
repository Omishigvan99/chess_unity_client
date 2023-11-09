import React, { useState } from 'react'
import { Button, Form, Input, Modal } from 'antd'
const LoginView = ({ open, setOpenLogin = () => {} }) => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    })

    const onSubmitHandler = (e) => {
        // e.preventDefault
        console.log(loginData)
        setOpenLogin(false)
    }
    return (
        <Modal
            open={open}
            onOk={() => setOpenLogin({ id: 0, state: false })}
            onCancel={() => setOpenLogin({ id: 0, state: false })}
        >
            <Form
                name="wrap"
                labelCol={{
                    flex: '110px',
                }}
                labelAlign="left"
                labelWrap
                wrapperCol={{
                    flex: 1,
                }}
                colon={false}
                style={{
                    maxWidth: 600,
                    marginTop: '20px',
                }}
            >
                <Form.Item
                    style={{ marginTop: '1.2rem' }}
                    label="Enter Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        value={loginData.email}
                        type="email"
                        onChange={(e) =>
                            setLoginData({
                                ...loginData,
                                email: e.target.value,
                            })
                        }
                    />
                </Form.Item>

                <Form.Item
                    label="enter password"
                    name="password"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        type="password"
                        value={loginData.password}
                        onChange={(e) =>
                            setLoginData({
                                ...loginData,
                                password: e.target.value,
                            })
                        }
                    />
                </Form.Item>

                <Form.Item label=" ">
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={(e) => onSubmitHandler(e)}
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default LoginView
