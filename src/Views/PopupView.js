import { useState } from 'react'
import { Button, Modal, Input } from 'antd'

const PopupView = ({
    openPopup,
    setOpenPopup = () => {},
    socketId = 1038838,
}) => {
    const [invite, setInvite] = useState('')

    const onClickHandler = () => {
        alert(invite)
        setOpenPopup(false)
    }
    return (
        <Modal
            open={openPopup}
            onCancel={() => setOpenPopup(false)}
            onOk={() => setOpenPopup(false)}
        >
            <label>Your ID</label>
            <Input style={{ marginTop: '20px' }} value={socketId} disabled />
            <Input
                style={{ marginTop: '20px' }}
                value={invite}
                onChange={(e) => setInvite(e.target.value)}
                placeholder="Enter Room ID"
            />

            <Button
                type="primary"
                style={{ marginTop: '20px' }}
                onClick={() => onClickHandler()}
            >
                Join Room
            </Button>
        </Modal>
    )
}
export default PopupView
