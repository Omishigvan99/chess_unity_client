import { Modal, Typography } from 'antd'
import React, { useContext } from 'react'
import { ModalContext } from '../../context/modal.context'

function Request() {
    const { openRequest, openRequestModal } = useContext(ModalContext)
    return (
        <Modal
            open={openRequest.open}
            cancelText="Reject"
            okText="Accept"
            title={openRequest.title}
            onOk={() => {
                openRequest.onAccept()
                openRequestModal(
                    false,
                    null,
                    null,
                    () => {},
                    () => {}
                )
            }}
            onCancel={() => {
                openRequest.onReject()
                openRequestModal(
                    false,
                    null,
                    null,
                    () => {},
                    () => {}
                )
            }}
        >
            <p>{openRequest.description}</p>
        </Modal>
    )
}

export default Request
