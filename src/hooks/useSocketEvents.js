import { useEffect } from 'react'
import { remoteChessEvent } from '../Components/board/ChessBoard'
import { movesToPgn } from '../utils/chess'
import * as constants from '../constants/chess'

/**
 * Custom hook to handle all socket events for the Arena component
 */
export const useSocketEvents = ({
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
}) => {
    useEffect(() => {
        if (!socket) return

        // Listen for 'user-connected' events from the server.
        socket.on('user-connected', (data) => {
            console.log(data)
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
            movesListRef.current = history // Update ref
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
            // Save the game - opponent resigned, so current player wins
            saveGameToServer({
                status: 'completed',
                winner: player.color,
                win_reason: 'resignation',
            })

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

                        // Save the game
                        saveGameToServer({
                            status: 'completed',
                            winner: null,
                            draw_reason: 'agreement',
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
                // Save the game
                saveGameToServer({
                    status: 'completed',
                    winner: null,
                    draw_reason: 'agreement',
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
            movesListRef.current = [] // Update ref
            setRoomBoardPgn(movesToPgn([]))
            success('New Game Started')
        })

        // Return a cleanup function to run when the component unmounts.
        return () => {
            // Remove all listeners from the socket to prevent memory leaks.
            socket.removeAllListeners()
        }
    }, [
        socket,
        player,
        opponent,
        params.roomId,
        auth.isAuthenticated,
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
    ])
}
