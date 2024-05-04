import { useCallback, useContext, useEffect, useState } from 'react'
import { Alert, Modal } from 'antd'
import { ModalContext } from '../../context/modal.context'
import Loading from '../UI/Loading'
import CreateGameForm from '../forms/CreateGame.form'
import { createRoom, deleteRoom } from '../../utils/rooms'
import { GlobalStore } from '../../store/global.store'
import { P2P_URL } from '../../constants/URL'

function CreateGame() {
    const { openCreateGame, setOpenCreateGame } = useContext(ModalContext)
    const [link, setLink] = useState(null)
    const [roomId, setRoomId] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [auth, _, guestId] = useContext(GlobalStore).auth
    const [error, setError] = useState({
        isError: false,
        message: '',
        description: '',
    })

    //function to initialize the room
    const initiateRoom = useCallback(async () => {
        try {
            const roomData = await createRoom(
                auth.isAuthenticated,
                auth.isAuthenticated ? auth.id : guestId
            )
            setLink(
                `${import.meta.env.VITE_APP_URL}${P2P_URL}/${roomData.roomId}`
            )
            setRoomId(roomData.roomId)
        } catch (error) {
            setIsLoading(false)
            setError({
                isError: true,
                message: error?.message || 'Unknown Error',
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
        initiateRoom()
        setIsLoading(false)
    }, [openCreateGame, initiateRoom])

    // handler to cancel the game creation
    function onCancelHandler() {
        deleteRoom(roomId, auth.isAuthenticated)
        setLink(null)
        setRoomId(null)
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
                    <Loading isLoading={isLoading}>
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
