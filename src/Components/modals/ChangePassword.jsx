import { useState, useContext } from 'react'
import { Modal, Form } from 'antd'
import ChangePasswordForm from '../forms/ChangePassword.form'
import { ModalContext } from '../../context/modal.context'

function ChangePassword() {
    const [form] = Form.useForm()
    const { openChangePassword, setOpenChangePassword } =
        useContext(ModalContext)
    const [error, setError] = useState({
        isError: false,
        message: null,
        description: null,
    })
    return (
        <Modal
            open={openChangePassword}
            footer={null}
            onCancel={() => {
                form.resetFields()
                setOpenChangePassword(false)
                setError({
                    isError: false,
                    description: null,
                    message: null,
                })
            }}
        >
            <ChangePasswordForm
                form={form}
                error={error}
                setError={setError}
            ></ChangePasswordForm>
        </Modal>
    )
}

export default ChangePassword
