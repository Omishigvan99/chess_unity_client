import { useState, useContext } from 'react'
import { Form, Modal } from 'antd'
import { ModalContext } from '../../context/modal.context'
import LoginForm from '../forms/Login.form'
const Login = () => {
    const [form] = Form.useForm()
    const { openLogin, setOpenLogin } = useContext(ModalContext)
    const [error, setError] = useState({
        isError: false,
        message: null,
        description: null,
    })

    return (
        <Modal
            open={openLogin}
            footer={null}
            onCancel={() => {
                form.resetFields()
                setOpenLogin(false)
                setError({
                    isError: false,
                    description: null,
                    message: null,
                })
            }}
        >
            <LoginForm
                form={form}
                error={error}
                setError={setError}
            ></LoginForm>
        </Modal>
    )
}
export default Login
