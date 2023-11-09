import React, { useState } from 'react'
import { Button, Form, Input, Modal } from 'antd'
const SignupView = ({ open, setOpenLogin = () => {} }) => {
    const [signupData, setSignUpData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
    })

    const onSubmitHandler = (e) => {
        console.log(signupData)
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
                    label="Enter first name"
                    name="firstName"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        placeholder="enter your first name"
                        value={signupData.fname}
                        onChange={(e) =>
                            setSignUpData({
                                ...signupData,
                                fname: e.target.value,
                            })
                        }
                    />
                </Form.Item>
                <Form.Item
                    label="Enter last name"
                    name="lastName"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        placeholder="enter your last name"
                        value={signupData.lname}
                        onChange={(e) =>
                            setSignUpData({
                                ...signupData,
                                lname: e.target.value,
                            })
                        }
                    />
                </Form.Item>
                <Form.Item
                    label="Enter Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        placeholder="enter your email id"
                        type="email"
                        value={signupData.email}
                        onChange={(e) =>
                            setSignUpData({
                                ...signupData,
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
                        placeholder="enter your first name"
                        value={signupData.password}
                        onChange={(e) =>
                            setSignUpData({
                                ...signupData,
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
                        Signup
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default SignupView
