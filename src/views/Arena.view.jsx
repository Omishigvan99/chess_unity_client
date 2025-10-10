import { useNavigate, useParams, useLocation } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { Row, Col, Card, Space } from 'antd'
import Loading from '../Components/UI/Loading'
import ChessBoard, { remoteChessEvent } from '../Components/board/ChessBoard'
import Player from '../Components/UI/Player'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useSocket } from '../hooks/useSocket'
import { MessageContext } from '../context/message.context'
import { getRoomDetails, joinRoom } from '../utils/rooms'
import { saveGame } from '../utils/games'
import { GlobalStore } from '../store/global.store'
import ActionsTab from '../Components/UI/ActionsTab'
import { ModalContext } from '../context/modal.context'
import * as constants from '../constants/chess'
import { movesToPgn } from '../utils/chess'
import { useSocketEvents } from '../hooks/useSocketEvents'

/**
 * ArenaView component is used to display the game arena where players can play chess.
 * @returns {JSX.Element} - Returns the JSX element of the component.
 **/
function ArenaView({ socketChannel = 'p2p' }) {
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
    const socket = useSocket(`/${socketChannel}`)
    const [roomBoardState, setRoomBoardState] = useState(null)
    const [roomBoardPgn, setRoomBoardPgn] = useState(null)
    const [previousMove, setPreviousMove] = useState(null)
    const [movesList, setMovesList] = useState([])

    // Use refs to avoid closure issues with stale state
    const movesListRef = useRef([])
    const roomBoardStateRef = useRef(null)

    // Keep refs in sync with state
    useEffect(() => {
        movesListRef.current = movesList
    }, [movesList])

    useEffect(() => {
        roomBoardStateRef.current = roomBoardState
    }, [roomBoardState])

    //getting color from URLSearchParams
    const color = URLSearchParams.get('color')
    const levelFromUrl = URLSearchParams.get('level')

    // Set initial stockfish level from URL or default to 3
    const [stockfishLevel, setStockfishLevel] = useState(() => {
        return levelFromUrl ? parseInt(levelFromUrl) : 3
    })
    const stockfishLevelRef = useRef(stockfishLevel)

    // Keep ref updated with current value
    useEffect(() => {
        stockfishLevelRef.current = stockfishLevel
    }, [stockfishLevel])

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
                    roomBoardStateRef.current = response.data.board // Update ref
                    // Set the previous move to the current previous move.
                    setPreviousMove(response.data.previousMove)
                    // Set the moves list to the current moves list.
                    setMovesList(() => response.data.history)
                    movesListRef.current = response.data.history // Update ref
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
                        stockfishLevel,
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

                //pushing url trimmed of color and level query parameters to history
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
                    stockfishLevel,
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
    }, [params.roomId, player, stockfishLevel])

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
    const onMoveHandler = useCallback(
        (move, FEN, history) => {
            const currentLevel = stockfishLevelRef.current
            socket.emit('move', {
                roomId: params.roomId,
                isGuest: !auth.isAuthenticated,
                move: move,
                FEN: FEN,
                history: history,
                stockfishLevel: currentLevel,
            })
            setMovesList(() => history)
            movesListRef.current = history // Update ref
            setRoomBoardState(FEN) // Update board state
            roomBoardStateRef.current = FEN // Update ref
        },
        [socket, params.roomId, auth.isAuthenticated]
    )

    // This function is used to handle the event when a remote player makes a move on the chessboard.
    const onRemoteMoveHandler = useCallback((move, FEN, history) => {
        setMovesList(() => history)
        movesListRef.current = history // Update ref
        setRoomBoardState(FEN) // Update board state
        roomBoardStateRef.current = FEN // Update ref
    }, [])

    // This function is used to save the game when it ends
    const saveGameToServer = useCallback(
        async (gameResult, customFEN = null, customMoves = null) => {
            try {
                // Only save if both players are present and it's not a bot game
                if (
                    !player.id ||
                    !opponent.id ||
                    opponent.id === 'stockfish17'
                ) {
                    return
                }

                // Determine who should save the game to prevent race conditions
                // Use a deterministic approach: player with lexicographically smaller ID saves the game
                // This ensures that exactly one player will always save, regardless of timing
                const shouldSave = player.id < opponent.id

                if (!shouldSave) {
                    console.log(
                        `Player ${opponent.id} (smaller ID) will save the game, not ${player.id}`
                    )
                    return
                }

                console.log(
                    `Player ${player.id} (smaller ID) is saving the game`
                )

                // Add a small delay to reduce race conditions further
                // This allows the server-side checks to process any potential concurrent requests
                await new Promise((resolve) => setTimeout(resolve, 200))

                // Use the most current data available (refs contain the latest values)
                const currentBoardState =
                    customFEN ||
                    roomBoardStateRef.current ||
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
                const currentMoves = customMoves || movesListRef.current

                console.log('Saving game with data:', {
                    boardState: currentBoardState,
                    movesCount: currentMoves.length,
                    moves: currentMoves,
                    gameResult,
                    // Debug info
                    stateMovesCount: movesList.length,
                    refMovesCount: movesListRef.current.length,
                    stateBoardState: roomBoardState,
                    refBoardState: roomBoardStateRef.current,
                })

                // Create a unique game identifier by combining roomId with timestamp
                // This ensures each game instance is saved separately even in the same room
                const uniqueGameId = `${params.roomId}_${Date.now()}`

                console.log(
                    `Saving game with unique ID: ${uniqueGameId} (original room: ${params.roomId})`
                )

                const gameData = {
                    roomId: params.roomId, // Keep original room ID for room association
                    gameInstanceId: uniqueGameId, // Unique identifier for this specific game instance
                    hostId: player.id, // The current player is considered the host for saving purposes
                    players: {
                        white:
                            player.color === 'white'
                                ? {
                                      id: player.id,
                                      name: player.name,
                                      rating: player.rating,
                                      avatar: player.avatar,
                                  }
                                : {
                                      id: opponent.id,
                                      name: opponent.name,
                                      rating: opponent.rating,
                                      avatar: opponent.avatar,
                                  },
                        black:
                            player.color === 'black'
                                ? {
                                      id: player.id,
                                      name: player.name,
                                      rating: player.rating,
                                      avatar: player.avatar,
                                  }
                                : {
                                      id: opponent.id,
                                      name: opponent.name,
                                      rating: opponent.rating,
                                      avatar: opponent.avatar,
                                  },
                    },
                    board: currentBoardState,
                    history: currentMoves,
                    status: gameResult.status,
                    winner: gameResult.winner,
                    draw_reason: gameResult.draw_reason,
                    win_reason: gameResult.win_reason,
                    type: socketChannel,
                }

                await saveGame(gameData)
                console.log('Game saved successfully by player:', player.id)
            } catch (error) {
                console.error('Failed to save game:', error)
                // Don't show error to user as this shouldn't interrupt their experience
            }
        },
        [player, opponent, params.roomId, socketChannel] // Removed roomBoardState and movesList dependencies
    )

    // This function is used to handle the event when a player wins the game by checkmate.
    const onCheckmateHandler = (color, fen = null, history = null) => {
        const isPlayerWinner = color !== player.color[0]
        const winner = isPlayerWinner
            ? player.color
            : player.color === 'white'
            ? 'black'
            : 'white'

        // Save the game with current board state and moves
        saveGameToServer(
            {
                status: 'completed',
                winner: winner,
                win_reason: 'checkmate',
            },
            fen,
            history
        )

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
    const onStalemateHandler = (fen = null, history = null) => {
        // Save the game with current board state and moves
        saveGameToServer(
            {
                status: 'completed',
                winner: null,
                draw_reason: 'stalemate',
            },
            fen,
            history
        )

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
    const onInsufficientMaterialHandler = (fen = null, history = null) => {
        // Save the game with current board state and moves
        saveGameToServer(
            {
                status: 'completed',
                winner: null,
                draw_reason: 'insufficient_material',
            },
            fen,
            history
        )

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
    const onThreefoldRepetitionHandler = (fen = null, history = null) => {
        // Save the game with current board state and moves
        saveGameToServer(
            {
                status: 'completed',
                winner: null,
                draw_reason: 'threefold_repetition',
            },
            fen,
            history
        )

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
            // Save the game - current player resigned, so opponent wins
            const opponentColor = player.color === 'white' ? 'black' : 'white'
            saveGameToServer({
                status: 'completed',
                winner: opponentColor,
                win_reason: 'resignation',
            })

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
        // check if playing against chessbot
        if (opponent.id === 'stockfish17') {
            resetGame()
            return
        }

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

    // function to reset game state while playing against chessbot
    const resetGame = useCallback(() => {
        const currentLevel = stockfishLevelRef.current
        remoteChessEvent.resetBoard(params.roomId)
        socket.emit('reset', {
            roomId: params.roomId,
            isGuest: !auth.isAuthenticated,
            stockfishLevel: currentLevel,
        })
    }, [params.roomId, socket, auth.isAuthenticated])

    //function to quit the game
    const quitGame = () => {
        leaveRoomHandler()
        navigate('/')
    }

    // Use custom hook to handle all socket events
    useSocketEvents({
        socket,
        player,
        opponent,
        params,
        auth,
        setOpponent,
        setMovesList,
        movesListRef,
        setPreviousMove,
        setRoomBoardPgn,
        saveGameToServer,
        openGameResultModal,
        openRequestModal,
        requestRematch,
        quitGame,
        success,
        error,
        navigate,
    })

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
                        md={12}
                        xl={14}
                        xxl={14}
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
                                onRemoteMove={onRemoteMoveHandler}
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
                        md={12}
                        xl={10}
                        xxl={10}
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
                                onReset={resetGame}
                                onDepthChange={(value) => {
                                    setStockfishLevel(value)
                                }}
                                stockfishLevel={stockfishLevel}
                                mode={socketChannel}
                            ></ActionsTab>
                        </Card>
                    </Col>
                </Row>
            </Loading>
        </>
    )
}

export default ArenaView
