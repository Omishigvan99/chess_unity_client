import { useNavigate, useParams, useLocation } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { Row, Col, Card, Space } from 'antd'
import Loading from '../Components/UI/Loading'
import ChessBoard, { remoteChessEvent } from '../Components/board/ChessBoard'
import Player from '../Components/UI/Player'
import { useContext, useEffect, useRef, useState } from 'react'
import { useSocket } from '../hooks/useSocket'
import { MessageContext } from '../context/message.context'
import { getRoomDetails, joinRoom } from '../utils/rooms'
import { GlobalStore } from '../store/global.store'
import ActionsTab from '../Components/UI/ActionsTab'
import { ModalContext } from '../context/modal.context'
import * as constants from '../constants/chess'
import { movesToPgn } from '../utils/chess'

/**
 * ArenaView component is used to display the game arena where players can play chess.
 * @returns {JSX.Element} - Returns the JSX element of the component.
 **/
function ArenaView() {
    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [URLSearchParams] = useSearchParams()
    const { openGameResultModal, openRequestModal } = useContext(ModalContext)
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
    const [roomBoardPgn, setRoomBoardPgn] = useState(null)
    const [previousMove, setPreviousMove] = useState(null)
    const [movesList, setMovesList] = useState([])

    //getting color from URLSearchParams
    const color = URLSearchParams.get('color')

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

    // This useEffect hook is used to handle the socket events
    useEffect(() => {
        // Listen for 'user-connected' events from the server.
        socket.on('user-connected', (data) => {
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
            //set the opponent state with the opponent data from the server response.
            if (data.id === opponent.id) {
                setOpponent((prevState) => {
                    return {
                        ...prevState,
                        isConnected: false,
                    }
                })
                error(`${data.name} disconnected`)
            }
        })

        // listen for 'move' events from the server.
        socket.on('remote-move', (data) => {
            const { move, history } = data
            // add the move to the moves list.
            setMovesList(() => history)
            // Emit the move to the remote chess event listeners.
            remoteChessEvent.sendMove(params.roomId, move)
        })

        // listen for 'rematch:request' events from the server.
        socket.on('rematch:request', () => {
            openRequestModal(
                true,
                'Rematch Request',
                'Your opponent has requested a rematch. Do you accept?',
                () => {
                    try {
                        // Emit a 'rematch:response' event to the opponent with the response as 'accept'.
                        socket.emit('rematch:response', {
                            roomId: params.roomId,
                            isGuest: !auth.isAuthenticated,
                            response: 'accept',
                        })
                    } catch (err) {
                        error('Failed to accept rematch request')
                    }
                },
                () => {
                    try {
                        // Emit a 'rematch:response' event to the opponent with the response as 'reject'.
                        socket.emit('rematch:response', {
                            roomId: params.roomId,
                            isGuest: !auth.isAuthenticated,
                            response: 'reject',
                        })

                        //navigate to home page
                        navigate('/')
                    } catch (err) {
                        error('Failed to reject rematch request')
                    }
                }
            )
        })

        // listen for 'rematch:accept' events from the server.
        socket.on('rematch:response', (data) => {
            if (data.response === 'accept') {
                // close the game result modal and reset the board.
                openGameResultModal(false, {
                    type: 'rematch',
                    color: null,
                    playerImageUrl: player.avatar,
                    opponentImageUrl: opponent.avatar,
                    message: constants.REMATCH_AGREED,
                    requestRematch: () => {},
                    quit: () => {},
                })

                socket.emit('reset', {
                    roomId: params.roomId,
                    isGuest: !auth.isAuthenticated,
                })
            } else if (data.response === 'reject') {
                error('Rematch request rejected')
            }
        })

        // listen for 'resign' events from the server.
        socket.on('resignation', () => {
            openGameResultModal(true, {
                type: 'win',
                color: player.color[0],
                playerImageUrl: player.avatar,
                opponentImageUrl: opponent.avatar,
                message: constants.WIN_RESIGNATION,
                requestRematch: requestRematch,
                quit: quitGame,
            })
        })

        // listen for 'draw:request' events from the server.
        socket.on('draw:request', () => {
            openRequestModal(
                true,
                'Draw Request',
                'Your opponent has requested a draw. Do you accept?',
                () => {
                    try {
                        socket.emit('draw:response', {
                            roomId: params.roomId,
                            isGuest: !auth.isAuthenticated,
                            response: 'accept',
                        })
                        openGameResultModal(true, {
                            type: 'draw',
                            color: null,
                            playerImageUrl: player.avatar,
                            opponentImageUrl: opponent.avatar,
                            message: constants.DRAW_AGREED,
                            requestRematch: requestRematch,
                            quit: quitGame,
                        })
                    } catch (err) {
                        error('Failed to accept draw request')
                    }
                },
                () => {
                    try {
                        socket.emit('draw:response', {
                            roomId: params.roomId,
                            isGuest: !auth.isAuthenticated,
                            response: 'reject',
                        })
                    } catch (err) {
                        error('Failed to reject draw request')
                    }
                }
            )
        })

        // listen for 'draw:response' events from the server.
        socket.on('draw:response', (data) => {
            if (data.response === 'accept') {
                openGameResultModal(true, {
                    type: 'draw',
                    color: null,
                    playerImageUrl: player.avatar,
                    opponentImageUrl: opponent.avatar,
                    message: constants.DRAW_AGREED,
                    requestRematch: requestRematch,
                    quit: quitGame,
                })
            }

            if (data.response === 'reject') {
                error('Draw request rejected')
            }
        })

        // listen for 'reset' events from the server.
        socket.on('game:reset', () => {
            console.log('Game Reset')
            remoteChessEvent.resetBoard(params.roomId)
            setPreviousMove(null)
            setMovesList([])
            setRoomBoardPgn(movesToPgn([]))
            success('New Game Started')
        })

        // Return a cleanup function to run when the component unmounts.
        return () => {
            // Remove all listeners from the socket to prevent memory leaks.
            socket.removeAllListeners()
        }
    }, [player, opponent, params.roomId])

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
                    // Set the moves list to the current moves list.
                    setMovesList(() => response.data.history)
                    // Set the board state to the PGN format of the moves list.
                    setRoomBoardPgn(movesToPgn(response.data.history))
                }

                let opponent = null
                let opponentColor = null

                // check if opponent exists in the room and is of color other than the player.
                if (
                    response.data.players.white &&
                    response.data.players.white?.id !== player.id
                ) {
                    opponent = response.data.players.white
                    opponentColor = 'white'
                }

                if (
                    response.data.players.black &&
                    response.data.players.black?.id !== player.id
                ) {
                    opponent = response.data.players.black
                    opponentColor = 'black'
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

                let playerColor = color

                // If no color and there is opponent then set player color opposite to opponent
                if (!playerColor && opponent) {
                    playerColor = opponentColor === 'white' ? 'black' : 'white'
                }

                //pushing url trimmed of color query to history
                navigate(location.pathname, {
                    replace: true,
                })

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
            {
                roomId: params.roomId,
                playerId: player.id,
                name: player.name,
                rating: player.rating,
                isGuest: !auth.isAuthenticated,
            },
            // Callback function to handle the server response.
            (response) => {
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
    const onMoveHandler = (move, FEN, history) => {
        socket.emit('move', {
            roomId: params.roomId,
            isGuest: !auth.isAuthenticated,
            move: move,
            FEN: FEN,
            history: history,
        })
        setMovesList(() => history)
    }

    // This function is used to handle the event when a player wins the game by checkmate.
    const onCheckmateHandler = (color) => {
        openGameResultModal(true, {
            type: color === player.color[0] ? 'loss' : 'win',
            color: color === 'w' ? 'b' : 'w',
            playerImageUrl: player.avatar,
            opponentImageUrl: opponent.avatar,
            message:
                color === player.color[0]
                    ? constants.LOSS_CHECKMATE
                    : constants.WIN,
            requestRematch: requestRematch,
            quit: quitGame,
        })
    }

    // This function is used to handle the event when a player wins the game by stalemate.
    const onStalemateHandler = () => {
        openGameResultModal(true, {
            type: 'draw',
            color: null,
            playerImageUrl: player.avatar,
            opponentImageUrl: opponent.avatar,
            message: constants.DRAW_STALEMATE,
            requestRematch: requestRematch,
            quit: quitGame,
        })
    }

    // This function is used to handle the event when a player wins the game by insufficient material.
    const onInsufficientMaterialHandler = () => {
        openGameResultModal(true, {
            type: 'draw',
            color: null,
            playerImageUrl: player.avatar,
            opponentImageUrl: opponent.avatar,
            message: constants.DRAW_INSUFFICIENT_MATERIAL,
            requestRematch: requestRematch,
            quit: quitGame,
        })
    }

    // This function is used to handle the event when a player wins the game by threefold repetition.
    const onThreefoldRepetitionHandler = () => {
        openGameResultModal(true, {
            type: 'draw',
            color: null,
            playerImageUrl: player.avatar,
            opponentImageUrl: opponent.avatar,
            message: constants.DRAW_THREEFOLD_REPETITION,
            requestRematch: requestRematch,
            quit: quitGame,
        })
    }

    // function to resign from the game
    const resign = () => {
        try {
            socket.emit('resign', {
                roomId: params.roomId,
                isGuest: !auth.isAuthenticated,
            })
            success('Resigned')
        } catch (err) {
            error('Failed to resign')
        }
    }

    // function to request a draw
    const requestDraw = () => {
        try {
            socket.emit('draw:request', {
                roomId: params.roomId,
                isGuest: !auth.isAuthenticated,
            })
            success('Draw Requested')
        } catch (err) {
            error('Failed to request draw')
        }
    }

    //function to request a rematch
    const requestRematch = () => {
        try {
            socket.emit('rematch:request', {
                roomId: params.roomId,
                isGuest: !auth.isAuthenticated,
            })
            success('Rematch Requested')
        } catch (err) {
            error('Failed to request rematch')
        }
    }

    //function to quit the game
    const quitGame = () => {
        leaveRoomHandler()
        navigate('/')
    }

    return (
        <>
            <Loading isLoading={isLoading}>
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
                                pgn={roomBoardPgn}
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
                                onMove={onMoveHandler}
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
                    <Col
                        style={{
                            height: '100%',
                        }}
                        xs={24}
                        sm={24}
                        md={10}
                        xl={8}
                        xxl={8}
                    >
                        <Card
                            style={{
                                height: '100%',
                                overflow: 'auto',
                            }}
                        >
                            <ActionsTab
                                movesList={movesList}
                                onLeaveRoom={leaveRoomHandler}
                                onRequestDraw={requestDraw}
                                onResign={resign}
                            ></ActionsTab>
                        </Card>
                    </Col>
                </Row>
            </Loading>
        </>
    )
}

export default ArenaView
