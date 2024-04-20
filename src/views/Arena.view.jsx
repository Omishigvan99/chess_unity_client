import { useNavigate, useParams } from 'react-router'
import { Row, Col, Card, Space, Button } from 'antd'
import Loading from '../Components/UI/Loading'
import ChessBoard, { remoteMove } from '../Components/board/ChessBoard'
import Player from '../Components/UI/Player'
import { useContext, useEffect, useRef, useState } from 'react'
import { useSocket } from '../hooks/useSocket'
import { useSearchParams } from 'react-router-dom'
import { MessageContext } from '../context/message.context'
import { getRoomDetails, joinRoom } from '../utils/rooms'
import { GlobalStore } from '../store/global.store'

/**
 * ArenaView component is used to display the game arena where players can play chess.
 * @returns {JSX.Element} - Returns the JSX element of the component.
 **/
function ArenaView() {
    const params = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [auth, _, guestId] = useContext(GlobalStore).auth
    const { success, error } = useContext(MessageContext)
    const [player, setPlayer] = useState({
        id: null,
        name: null,
        rating: 1000,
    })
    const [opponent, setOpponent] = useState({
        id: null,
        name: null,
        rating: null,
        isConnected: false,
        color: null,
    })
    const [isPlayerInRoom, setIsPlayerInRoom] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [size, setSize] = useState(null)
    const rowContainer = useRef(null)
    const colContainer = useRef(null)
    const socket = useSocket('/p2p')
    const [roomBoardState, setRoomBoardState] = useState(null)
    const [previousMove, setPreviousMove] = useState(null)
    const [movesList, setMovesList] = useState([])

    // This useEffect hook is to set current player
    useEffect(() => {
        setPlayer((prevState) => {
            return {
                ...prevState,
                id: auth.isAuthenticated ? auth.id : guestId,
                name: auth.isAuthenticated ? auth.name : 'Guest:' + guestId,
                avatar: auth.avatar,
            }
        })
    }, [auth.isAuthenticated, guestId])

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
                    avatar: data.avatar,
                    isConnected: true,
                })
                success(`${data.name} connected`)
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
                console.log(data)
                error(`${data.name} disconnected`)
            }
        })

        // listen for 'move' events from the server.
        socket.on('remote-move', (move) => {
            move = JSON.parse(move)
            // add the move to the moves list.
            setMovesList((prevState) => [...prevState, move.to])
            // Emit the move to the remote chess event listeners.
            remoteMove.sendMove(params.roomId, move)
        })

        // Return a cleanup function to run when the component unmounts.
        return () => {
            // Remove all listeners from the socket to prevent memory leaks.
            socket.removeAllListeners()
        }
    }, [player, opponent])

    // This useEffect hook is used to handle room joining when the component mounts.
    useEffect(() => {
        // Check if necessary dependencies are present and if the player is already in the room.
        if (!socket || !params.roomId || !player.id || isPlayerInRoom)
            return // Asynchronous function to handle room joining logic.
        ;(async () => {
            try {
                // Set loading state to true to indicate loading state.
                setIsLoading(true)

                // Fetch room details from the server.
                const response = await getRoomDetails(socket, {
                    roomId: params.roomId,
                    isGuest: !auth.isAuthenticated,
                })

                //setting board state based on current room state
                if (response.data.board && response.data.previousMove) {
                    // Set the board state to the current board state.
                    setRoomBoardState(response.data.board)
                    // Set the previous move to the current previous move.
                    setPreviousMove(response.data.previousMove)
                }

                let opponent = null

                // check if opponent exists in the room and is of color other than the player.
                if (
                    response.data.players.white &&
                    response.data.players.white?.id !== player.id
                ) {
                    opponent = response.data.players.white
                }

                if (
                    response.data.players.black &&
                    response.data.players.black?.id !== player.id
                ) {
                    opponent = response.data.players.black
                }

                // If opponent exists, set opponent state.
                if (opponent) {
                    setOpponent({
                        id: opponent.id,
                        name: opponent.name,
                        rating: opponent.rating,
                        avatar: opponent.avatar,
                        isConnected: true,
                    })
                }

                // Check if the player is already in the room as white or black.
                const isPlayerWhite =
                    response.data.players.white?.id === player.id
                const isPlayerBlack =
                    response.data.players.black?.id === player.id

                if (isPlayerWhite || isPlayerBlack) {
                    // Player is already in the room.
                    console.log('Player already in room')
                    setIsLoading(false)

                    // Determine player's color.
                    const playerColor = isPlayerWhite ? 'white' : 'black'

                    // Join the room with player details.
                    await joinRoom(socket, {
                        roomId: params.roomId,
                        playerId: player.id,
                        name: player.name,
                        rating: player.rating,
                        avatar: player.avatar,
                        isGuest: !auth.isAuthenticated,
                        color: playerColor,
                    })

                    // Update player's color and set player in room state.
                    setPlayer((prevState) => ({
                        ...prevState,
                        color: playerColor,
                    }))
                    setIsPlayerInRoom(true)

                    // Display success message.
                    success('Joined Room Successfully')
                    return
                }

                // Determine player's color based on current room state.
                const playerColor = response.data.players.white
                    ? 'black'
                    : 'white'

                // Join the room with player details.
                await joinRoom(socket, {
                    roomId: params.roomId,
                    playerId: player.id,
                    name: player.name,
                    rating: player.rating,
                    avatar: player.avatar,
                    isGuest: !auth.isAuthenticated,
                    color: playerColor,
                })

                // Update player's color and set player in room state.
                setPlayer((prevState) => ({
                    ...prevState,
                    color: playerColor,
                }))
                setIsLoading(false)
                setIsPlayerInRoom(true)

                // Display success message.
                success('Joined Room Successfully')
            } catch (err) {
                // Log error and update loading state to indicate failure.
                console.log(err)
                setIsLoading(false)
                error('Failed to join Room')
            }
        })()
    }, [params.roomId, player])

    // This useEffect hook is used to handle the resizing of the row and column containers.
    useEffect(() => {
        // If the row or column container refs are not set, exit the function.
        if (!rowContainer.current || !colContainer.current || isLoading) return

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
    }, [rowContainer, colContainer, isLoading])

    // This function is used to handle the event when a player leaves a room.
    const leaveRoomHandler = () => {
        if (!params.roomId) return
        // Emit a 'leave-room' event to the server with the room and player details.
        socket.emit(
            'leave-room',
            JSON.stringify({
                roomId: params.roomId,
                playerId: player.id,
                name: player.name,
                rating: player.rating,
                isGuest: !auth.isAuthenticated,
            }),
            // Callback function to handle the server response.
            (response) => {
                // Log the response to the console.
                console.log(response)
                // Show a notification that the room was left successfully.
                if (response.success) {
                    success('Left Room Successfully')
                } else {
                    // Show a notification that there was an error leaving the room.
                    error('Failed to Leave Room')
                }
                // Navigate to the home page.
                navigate('/')
            }
        )
    }

    // This function is used to handle the event when a player makes a move on the chessboard.
    const onMoveHandler = (move, FEN, pgn) => {
        console.log(move)
        socket.emit(
            'move',
            JSON.stringify({
                roomId: params.roomId,
                isGuest: !auth.isAuthenticated,
                move: move,
                FEN: FEN,
                pgn: pgn,
            })
        )
        setMovesList((prevState) => [...prevState, move.to])
    }

    // This function is used to handle the event when a player wins the game by checkmate.
    const onCheckmateHandler = (color) => {
        success(`${color} wins by checkmate`)
        //TODO: handle checkmate
    }

    // This function is used to handle the event when a player wins the game by stalemate.
    const onStalemateHandler = () => {
        console.log('Stalemate')
        success('Stalemate')
        //TODO: handle stalemate
    }

    // This function is used to handle the event when a player wins the game by insufficient material.
    const onInsufficientMaterialHandler = () => {
        console.log('Insufficient Material')
        success('Insufficient Material')
        //TODO: handle insufficient material
    }

    // This function is used to handle the event when a player wins the game by threefold repetition.
    const onThreefoldRepetitionHandler = () => {
        console.log('Threefold Repetition')
        success('Threefold Repetition')
        //TODO: handle threefold repetition
    }

    return (
        <>
            <Loading isloading={isLoading}>
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
                                imageSrc={opponent.avatar}
                            ></Player>
                            <ChessBoard
                                id={params.roomId}
                                size={size}
                                FEN={roomBoardState}
                                previousPlayedMove={previousMove}
                                options={{
                                    flip:
                                        player.color === 'black' ? true : false,
                                    draggable: opponent.isConnected,
                                    clickable: opponent.isConnected,
                                    activeColor:
                                        player.color === 'black' ? 'b' : 'w',
                                    enableGuide: true,
                                }}
                                onmove={onMoveHandler}
                                onCheckmate={onCheckmateHandler}
                                onInsufficientMaterial={
                                    onInsufficientMaterialHandler
                                }
                                onStalemate={onStalemateHandler}
                                onThreefoldRepetition={
                                    onThreefoldRepetitionHandler
                                }
                            ></ChessBoard>
                            <Player
                                name={player.name}
                                rating={player.rating}
                                imageSrc={auth.avatar}
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
            </Loading>
        </>
    )
}

export default ArenaView
