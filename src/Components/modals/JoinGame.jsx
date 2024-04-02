import { Modal } from 'antd'
import { ModalContext } from '../../context/modal.context'
import { useContext } from 'react'
import JoinGameForm from '../forms/JoinGame.form'

function JoinGame() {
    const { openJoinGame, setOpenJoinGame } = useContext(ModalContext)
    return (
        <Modal
            open={openJoinGame}
            footer={null}
            onCancel={() => {
                setOpenJoinGame(false)
            }}
        >
            <JoinGameForm></JoinGameForm>
        </Modal>
    )
}

export default JoinGame
