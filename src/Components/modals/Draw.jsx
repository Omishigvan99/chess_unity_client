import { Modal, Typography } from 'antd'
import React, { useContext } from 'react'
import { ModalContext } from '../../context/modal.context'

function Draw() {
    const { openDraw, openDrawModal } = useContext(ModalContext)
    return (
        <Modal
            open={openDraw.open}
            cancelText="Reject"
            okText="Accept"
            title="Draw Request"
            onOk={() => {
                openDraw.onAccept()
                openDrawModal(
                    false,
                    () => {},
                    () => {}
                )
            }}
            onCancel={() => {
                openDraw.onReject()
                openDrawModal(
                    false,
                    () => {},
                    () => {}
                )
            }}
        >
            <p>
                Opponent has offered a{' '}
                <Typography.Text strong>DRAW</Typography.Text>
            </p>
        </Modal>
    )
}

export default Draw
