import { useContext, useEffect, useState } from 'react'
import { Alert, Modal } from 'antd'
import { ModalContext } from '../../context/modal.context'
import Loading from '../UI/Loading'
import CreateGameForm from '../forms/CreateGame.form'
import { createRoom, deleteRoom } from '../../utils/rooms'
import { useAuthReducer } from '../../store/auth.store'

function CreateGame() {
    const { openCreateGame, setOpenCreateGame } = useContext(ModalContext)
    const [link, setLink] = useState(null)
    const [roomId, setRoomId] = useState(null)
    const [hostId, setHostId] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [auth, _] = useAuthReducer()
    const [error, setError] = useState({
        isError: false,
        message: '',
        description: '',
    })

    // useEffect to create room on server
    useEffect(() => {
        if (!openCreateGame) return
        async function initiatRoom() {
            try {
                const roomData = await createRoom(auth.isAuthenticated)
                setLink(`http://localhost:8000/arena/${roomData.roomId}`)
                setRoomId(roomData.roomId)
                setHostId(roomData.hostId)
                setIsLoading(false)
            } catch (error) {
                setError({
                    isError: true,
                    message: error?.message || 'Unknow Error',
                    description:
                        error?.description ||
                        'Something went wrong while creating game',
                })
            }
        }

        // call the function to create room
        initiatRoom()
    }, [openCreateGame])

    // handler to cancel the game creation
    function onCancelHandler() {
        deleteRoom(roomId, auth.isAuthenticated)
        setLink(null)
        setRoomId(null)
        setHostId(null)
        setOpenCreateGame(false)
    }

    return (
        <Modal open={openCreateGame} footer={null} onCancel={onCancelHandler}>
            {error.isError ? (
                <>
                    <Alert
                        message={error.message}
                        description={error.description}
                        type="error"
                        showIcon
                    />
                </>
            ) : (
                <>
                    <Loading isloading={isLoading}>
                        <CreateGameForm
                            link={link}
                            roomId={roomId}
                            hostId={hostId}
                        ></CreateGameForm>
                    </Loading>
                </>
            )}
        </Modal>
    )
}

export default CreateGame
