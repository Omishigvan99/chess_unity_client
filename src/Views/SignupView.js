import React from 'react'
import { Button, Form, Input, Modal } from 'antd'
const SignupView = ({ open, setOpenLogin = () => {} }) => (
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
                label="Enter first name"
                name="fname"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Enter last name"
                name="lname"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
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
                <Input />
            </Form.Item>

            <Form.Item
                label="enter password"
                name="password"
                type="password"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item label=" ">
                <Button type="primary" htmlType="submit">
                    Signup
                </Button>
            </Form.Item>
        </Form>
    </Modal>
)
export default SignupView
