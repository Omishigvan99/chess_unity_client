import { useContext, useState } from 'react'
import { Form, Modal } from 'antd'
import { ModalContext } from '../../context/modal.context'
import SignupForm from '../forms/Signup.form'

const SignupView = () => {
    const { openSignup, setOpenSignup } = useContext(ModalContext)
    const [error, setError] = useState({
        isError: false,
        message: null,
        description: null,
    })
    const [form] = Form.useForm()
    return (
        <Modal
            open={openSignup}
            onCancel={() => {
                form.resetFields()
                setOpenSignup(false)
            }}
            footer={null}
        >
            <SignupForm
                error={error}
                setError={setError}
                form={form}
            ></SignupForm>
        </Modal>
    )
}
export default SignupView
