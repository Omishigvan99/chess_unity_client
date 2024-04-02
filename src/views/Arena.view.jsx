import { useNavigate, useParams } from 'react-router'
import { Row, Col, Card, Space, Button } from 'antd'
import Loading from '../Components/UI/Loading'
import ChessBoard from '../Components/board/ChessBoard'
import Player from '../Components/UI/Player'
import { useContext, useEffect, useRef, useState } from 'react'
import { useSocket } from '../hooks/useSocket'
import { useAuthReducer } from '../store/auth.store'
import { useSearchParams } from 'react-router-dom'
import { NotificationContext } from '../context/notification.context'
import { nanoid } from 'nanoid'
import { getRoomDetails, joinRoom } from '../utils/rooms'

/**
 * ArenaView component is used to display the game arena where players can play chess.
 * @returns {JSX.Element} - Returns the JSX element of the component.
 **/
function ArenaView() {
    const params = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [auth, _] = useAuthReducer()
    const { openNotification } = useContext(NotificationContext)
    const guestId = nanoid(20)
    const [player, setPlayer] = useState(
        auth.isAuthenticated
            ? {
                  id: searchParams.get('hostId') || nanoid(),
                  name: auth.username,
                  rating: 1000,
                  color: null,
              }
            : {
                  id: searchParams.get('hostId') || guestId,
                  name: searchParams.get('hostId')
                      ? `Guest:${searchParams.get('hostId')}`
                      : `Guest-${guestId}`,
                  rating: 1000,
                  color: null,
              }
    )
    const [opponent, setOpponent] = useState({
        id: null,
        name: null,
        rating: null,
        isConnected: false,
        color: null,
    })
    const [hasJoined, setHasJoined] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [size, setSize] = useState(null)
    const rowContainer = useRef(null)
    const colContainer = useRef(null)
    const socket = useSocket('/p2p')

    // This useEffect hook is used to handle the socket events for user connection and disconnection.
    useEffect(() => {
        // Listen for 'user-connected' events from the server.
        socket.on('user-connected', (data) => {
            data = JSON.parse(data)
            //set the opponent state with the opponent data from the server response.
            if (data.id !== player.id) {
                setOpponent({
                    id: data.id,
                    name: data.name,
                    rating: data.rating,
                    isConnected: true,
                })
                openNotification('success', 'Opponent Connected', data.name)
            }
        })

        // Listen for 'user-disconnected' events from the server.
        socket.on('user-disconnected', (data) => {
            data = JSON.parse(data)
            //set the opponent state with the opponent data from the server response.
            if (data.id === opponent.id) {
                setOpponent((prevState) => {
                    return {
                        ...prevState,
                        isConnected: false,
                    }
                })
                openNotification('error', 'Opponent Disconnected', data.name)
            }
        })
        // Return a cleanup function to run when the component unmounts.
        return () => {
            // Remove all listeners from the socket to prevent memory leaks.
            socket.removeAllListeners()
        }
    }, [player, opponent])

    // This useEffect hook is used to handle the socket connection and room joining when the component mounts.
    useEffect(() => {
        // If there is no socket connection or room ID, exit the function.
        if (!socket || !params.roomId || hasJoined) return
        ;(async () => {
            try {
                // Set the loading state to true.
                setIsLoading(true)
                let response = await getRoomDetails(socket, {
                    roomId: params.roomId,
                    isGuest: !auth.isAuthenticated,
                })

                // Update the room state with the room data from the server response after successful joining.
                response = await joinRoom(socket, {
                    roomId: params.roomId,
                    playerId: player.id,
                    rating: player.rating,
                    name: player.name,
                    isGuest: !auth.isAuthenticated,
                    color: !response.data?.players.white ? 'white' : 'black',
                })

                //set the opponent state with the opponent data from the server response.
                if (
                    response.data.players.white &&
                    response.data.players.white.id !== player.id
                ) {
                    setOpponent({
                        id: response.data.players.white.id,
                        name: response.data.players.white.name,
                        rating: response.data.players.white.rating,
                        isConnected: true,
                    })
                    setPlayer((prevState) => {
                        return {
                            ...prevState,
                            color: 'black',
                        }
                    })
                } else if (
                    response.data.players.black &&
                    response.data.players.black.id !== player.id
                ) {
                    setOpponent({
                        id: response.data.players.black.id,
                        name: response.data.players.black.name,
                        rating: response.data.players.black.rating,
                        isConnected: true,
                    })
                    setPlayer((prevState) => {
                        return {
                            ...prevState,
                            color: 'white',
                        }
                    })
                }

                setIsLoading(false)
                setHasJoined(true)
                openNotification('success', 'Joined Room', response.message)
            } catch (error) {
                console.error(error)
                openNotification('error', 'Failed to join Room', error.message)
            }
        })()

        // The effect hook depends on the room ID from the component's parameters.
    }, [params.roomId])

    // This useEffect hook is used to handle the resizing of the row and column containers.
    useEffect(() => {
        // If the row or column container refs are not set, exit the function.
        if (!rowContainer.current || !colContainer.current) return

        // Create a new ResizeObserver that updates the size state based on the dimensions of the row and column containers.
        const resizeObserver = new ResizeObserver(() => {
            const { height } = rowContainer.current.getBoundingClientRect()
            const { width } = colContainer.current.getBoundingClientRect()
            if (width < height) setSize(width - 12)
            else setSize(height - 90)
        })

        // Start observing the row and column containers for size changes.
        // Note: The observe method only takes one target at a time, so we need to call it separately for each container.
        resizeObserver.observe(rowContainer.current)
        resizeObserver.observe(colContainer.current)

        // Return a cleanup function to run when the component unmounts.
        return () => {
            // Disconnect the ResizeObserver to prevent memory leaks.
            resizeObserver.disconnect()
        }
        // The effect hook depends on the row and column container refs.
    }, [rowContainer, colContainer])

    // This function is used to handle the event when a player leaves a room.
    const leaveRoomHandler = () => {
        if (!params.roomId) return
        // Emit a 'leave-room' event to the server with the room and player details.
        socket.emit(
            'leave-room',
            JSON.stringify({
                roomId: params.roomId, // The ID of the room the player is leaving.
                playerId: player.id, // The ID of the player who is leaving.
                isGuest: !auth.isAuthenticated, // Whether the player is a guest or not.
            }),
            // Callback function to handle the server response.
            (response) => {
                // Log the server response.
                console.log(response)
                // Show a notification that the room was left successfully.
                openNotification(
                    response.success ? 'success' : 'error',
                    response.success ? 'left Room' : 'Failed to leave Room',
                    response.message
                )
                // Navigate to the home page.
                navigate('/')
            }
        )
    }

    return (
        <>
            <Loading
                isloading={isLoading}
                style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: '2',
                }}
            />
            <Row
                ref={rowContainer}
                gutter={[12, 12]}
                style={{
                    height: 'calc(100dvh - 100px)',
                }}
            >
                <Col
                    ref={colContainer}
                    xs={24}
                    sm={24}
                    md={14}
                    xl={16}
                    xxl={16}
                >
                    <Space
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                        direction="vertical"
                    >
                        <Player
                            name={opponent.name}
                            rating={opponent.rating}
                            isConnected={opponent.isConnected}
                        ></Player>
                        <ChessBoard
                            size={size}
                            options={{
                                flip: player.color === 'black',
                            }}
                        ></ChessBoard>
                        <Player
                            name={player.name}
                            rating={player.rating}
                        ></Player>
                    </Space>
                </Col>
                <Col xs={24} sm={24} md={10} xl={8} xxl={8}>
                    <Card
                        style={{
                            height: '100%',
                        }}
                    >
                        <Button
                            danger
                            type="primary"
                            onClick={leaveRoomHandler}
                        >
                            Leave Room
                        </Button>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default ArenaView
