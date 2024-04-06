import { useCallback, useContext, useEffect, useState } from 'react'
import { Alert, Modal } from 'antd'
import { ModalContext } from '../../context/modal.context'
import Loading from '../UI/Loading'
import CreateGameForm from '../forms/CreateGame.form'
import { createRoom, deleteRoom } from '../../utils/rooms'
import { GlobalStore } from '../../store/global.store'

function CreateGame() {
    const { openCreateGame, setOpenCreateGame } = useContext(ModalContext)
    const [link, setLink] = useState(null)
    const [roomId, setRoomId] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [auth, _, guestId] = useContext(GlobalStore).auth
    const [hostId, setHostId] = useState(null)
    const [error, setError] = useState({
        isError: false,
        message: '',
        description: '',
    })

    //function to initialize the room
    const initiatRoom = useCallback(async () => {
        try {
            const roomData = await createRoom(
                auth.isAuthenticated,
                auth.isAuthenticated ? auth.id : guestId
            )
            setLink(`http://localhost:8000/arena/${roomData.roomId}`)
            setRoomId(roomData.roomId)
            setHostId(roomData.hostId)
        } catch (error) {
            setIsLoading(false)
            setError({
                isError: true,
                message: error?.message || 'Unknow Error',
                description:
                    error?.description ||
                    'Something went wrong while creating game',
            })
        }
    }, [auth.isAuthenticated, auth.id, guestId])

    // useEffect to create room on server
    useEffect(() => {
        if (!openCreateGame) return
        // call the function to create room
        initiatRoom()
        setIsLoading(false)
    }, [openCreateGame, initiatRoom])

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
                        ></CreateGameForm>
                    </Loading>
                </>
            )}
        </Modal>
    )
}

export default CreateGame
