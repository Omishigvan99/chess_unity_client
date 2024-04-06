import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react'
import { useMultiRef } from '../../hooks/useMultiRef.js'

import BoardGuides from './BoardGuides.jsx'
import Tile from './Tile.jsx'
import PromotionModal from './PromotionModal.jsx'

import { ANIM_DURATION_1 } from '../../constants/chess.js'
import { Draggable, gsap } from 'gsap/all'
import { useGSAP } from '@gsap/react'

import { Chess } from 'chess.js'
import { RemoteChessEvent } from '../../utils/RemoteChessEvent.js'
import * as chessUtils from '../../utils/chess.js'

// registering Draggable plugin
gsap.registerPlugin(Draggable)

// get initial state of chess board
const initialState = new Chess().board()

// creating remote move event
export let remoteMove = new RemoteChessEvent()

const ChessBoard = ({
    id,
    FEN,
    size,
    options = {
        draggable: true,
        clickable: true,
        activeColor: undefined,
        enableGuide: true,
        flip: true,
        blackTileColor: '#8B5D3E',
        whiteTileColor: '#F0D9B5',
        guideBackgroundColor: '#3E291B',
        guideForegroundColor: '#F0D9B5',
    },
    onmove = () => {},
    onCheckmate = () => {},
    onStalemate = () => {},
    onInsufficientMaterial = () => {},
    onThreefoldRepetition = () => {},
}) => {
    const [board, setBoard] = useState(initialState)
    const [getDroppables, addDroppable] = useMultiRef()
    const { contextSafe } = useGSAP()
    const chessboard = useRef(null)
    const promotionModalRef = useRef(null)
    let selectedPiece = useRef(null).current
    let previousMove = useRef([]).current
    let previousLegalMoves = useRef([]).current
    let checkSquare = useRef(null).current

    // creating chess instance
    const chess = useMemo(() => new Chess(), [])

    //function to perform move
    let performMove = contextSafe(
        (
            currentMove,
            isRemoteMove,
            callback = () => {},
            zIndexReset = () => {}
        ) => {
            const squares = getDroppables()
            const pieces = squares
                .filter((square) => square.children[1])
                .map((square) => square.children[1])

            try {
                //checking if move is made from remote board
                if (!isRemoteMove) {
                    //checking if current move is promotion
                    if (
                        chessUtils.isMovePromotional(
                            selectedPiece.type,
                            selectedPiece.color,
                            currentMove.from,
                            currentMove.to,
                            board
                        )
                    ) {
                        chessUtils.showPromotionModal(
                            selectedPiece,
                            promotionModalRef.current,
                            currentMove
                        )
                        promotionModalRef.current.dataset.promotionFrom =
                            currentMove.from
                        promotionModalRef.current.dataset.promotionTo =
                            currentMove.to
                        zIndexReset()
                        return
                    }
                }

                chess.move({ ...currentMove })
                onmove({ ...currentMove }, chess.fen(), chess.pgn())

                //highlighting move played
                chessUtils.highlightMovePlayed(
                    [currentMove.from, currentMove.to],
                    squares,
                    () => {
                        previousMove = [currentMove.from, currentMove.to]
                    }
                )

                // checking if oposite player is in check
                if (chess.inCheck()) {
                    chessUtils.showCheck(chess.turn(), pieces, (square) => {
                        checkSquare = square
                    })
                } else {
                    let pieceColor = chess.turn() === 'w' ? 'b' : 'w'
                    chessUtils.removeCheck(pieceColor, pieces, () => {
                        checkSquare = null
                    })
                }

                // animating piece to square position
                let targetSquare = squares.find((square) => {
                    return square.id === currentMove.to
                })

                let targetPiece = pieces.find((piece) => {
                    return piece.dataset.square === currentMove.from
                })

                let rect1 = targetSquare.getBoundingClientRect()
                let rect2 = targetPiece.getBoundingClientRect()

                gsap.set(targetPiece, {
                    zIndex: 10,
                })
                gsap.to(targetPiece, {
                    x: '+=' + (rect1.left - rect2.left),
                    y: '+=' + (rect1.top - rect2.top),

                    onComplete: () => {
                        gsap.set(targetPiece, {
                            zIndex: 1,
                        })
                        selectedPiece = null
                        setBoard(chess.board())
                    },
                    ease: 'power3.inOut',
                    duration: ANIM_DURATION_1,
                })

                //removing previous highlights if any
                chessUtils.removeHighlights(squares, previousMove, checkSquare)
            } catch (err) {
                console.log(err)
                callback()
            }
        },
        [options.flip, options.activeColor, options.enableGuide]
    )

    // load fen
    useEffect(() => {
        if (FEN) {
            chess.load(FEN)
            setBoard(chess.board())
        }
    }, [FEN])

    // registering remote move event
    useEffect(() => {
        remoteMove.on('move', (chessboardId, move) => {
            if (chessboardId === id) {
                performMove(move, true)
            }
        })

        //removing remote move event
        return () => {
            remoteMove.off()
        }
    }, [performMove, id])

    // setting selected element to null and checking if game is over
    useEffect(() => {
        //checking if game is over
        if (chess.isGameOver()) {
            if (chess.isCheckmate()) {
                onCheckmate(chess.turn())
            } else if (chess.isStalemate()) {
                onStalemate()
            } else if (chess.isInsufficientMaterial()) {
                onInsufficientMaterial()
            } else if (chess.isThreefoldRepetition()) {
                onThreefoldRepetition()
            }
        }
    }, [board])

    // on square click event handler
    const onSquareClick = useCallback(
        function (event) {
            const squares = getDroppables()
            const pieces = squares
                .filter((square) => square.children[1])
                .map((square) => square.children[1])

            //removing previous highlights if any
            chessUtils.removeHighlights(squares, previousMove, checkSquare)

            if (!selectedPiece) return

            let currentMove = {
                from: selectedPiece.square,
                to: event.currentTarget.id,
            }

            //perform move on chess board
            performMove(
                currentMove,
                false,
                () => {
                    //setting selected piece to null in global state
                    selectedPiece = null
                },
                () => {
                    let piece = pieces.find(
                        (piece) => piece.dataset.square === currentMove.from
                    )
                    piece.style.zIndex = 0
                }
            )
        },
        [
            options.flip,
            options.clickable,
            options.activeColor,
            options.enableGuide,
        ]
    )

    // effect for handling click events
    useEffect(() => {
        let squares = getDroppables()

        // if clickable is false don't add events
        if (!options.clickable) {
            return
        }

        // adding click events on sqaures
        for (const sqaure of squares) {
            sqaure.onclick = onSquareClick
        }

        //clean up
        return () => {
            for (const square of squares) {
                square.onclick = null
            }
        }
    }, [options.flip, options.clickable])

    // on piece click event handler
    const onPieceClick = useCallback(
        function onPieceClick(event) {
            const squares = getDroppables()
            event.stopPropagation()
            //removing previous highlights if any
            chessUtils.removeHighlights(squares, previousMove, checkSquare)
            if (!selectedPiece) {
                //if piece is not of active color
                if (
                    options.activeColor &&
                    (options.activeColor === 'w' ||
                        options.activeColor === 'b') &&
                    event.target.dataset.color !== options.activeColor
                )
                    return
                //highlight selected piece
                highlightSelectedPiece(event)
            } else {
                let currentMove = {
                    from: selectedPiece.square,
                    to: event.target.dataset.square,
                }

                performMove(
                    currentMove,
                    false,
                    () => {
                        //if piece is not of active color
                        if (
                            options.activeColor &&
                            (options.activeColor === 'w' ||
                                options.activeColor === 'b') &&
                            event.target.dataset.color !== options.activeColor
                        )
                            return

                        //highlight selected piece if another piece of same color is clicked
                        highlightSelectedPiece(event)
                    },
                    () => {
                        gsap.set(event.target, {
                            zIndex: 0,
                        })
                    }
                )
            }
        },
        [
            options.activeColor,
            options.flip,
            options.enableGuide,
            options.clickable,
        ]
    )

    // function to highlight selected piece
    function highlightSelectedPiece(event) {
        const squares = getDroppables()
        //setting selected piece to global state
        selectedPiece = {
            square: event.target.dataset.square,
            color: event.target.dataset.color,
            type: event.target.dataset.type,
        }

        //highlighting selected piece
        chessUtils.highlightSelectedSquare(
            event.target.offsetParent.children[0]
        )

        let legalMoves = chess
            .moves({
                square: event.target.dataset.square,
                verbose: true,
            })
            .map((move) => move.to)

        //highlighting possible moves
        chessUtils.highlightPossibleMoves(
            options.enableGuide,
            legalMoves,
            squares,
            () => {
                previousLegalMoves = legalMoves
            }
        )
    }

    // on drag start event handler
    const onDragStart = useCallback(
        function (event) {
            const squares = getDroppables()

            //removing previous highlights if any
            chessUtils.removeHighlights(squares, previousMove, checkSquare)

            //setting selected piece to global state
            selectedPiece = {
                type: event.target.dataset.type,
                color: event.target.dataset.color,
                square: event.target.dataset.square,
            }

            //highlighting possible moves
            let legalMoves = selectedPiece.square
                ? chess
                      .moves({
                          square: selectedPiece.square,
                          verbose: true,
                      })
                      .map((move) => move.to)
                : []

            chessUtils.highlightPossibleMoves(
                options.enableGuide,
                legalMoves,
                squares,
                () => {
                    previousLegalMoves = legalMoves
                }
            )
            //highlighting selected piece
            chessUtils.highlightSelectedSquare(
                event.target.offsetParent.children[0]
            )
        },
        [
            options.flip,
            options.activeColor,
            options.enableGuide,
            options.draggable,
        ]
    )

    // on drag end event handler
    const onDragEnd = useCallback(
        function (event) {
            const squares = getDroppables()
            chessUtils.removeHighlights(squares, previousMove, checkSquare)
            let callback = () => {
                gsap.to(this.target, {
                    x: 0,
                    y: 0,
                    duration: ANIM_DURATION_1,
                    zIndex: 0,
                })

                //resetting selected piece to global state
                selectedPiece = null
            }

            //resetting z-index on drag end from promotion case
            let zIndexReset = () => {
                gsap.set(this.target, {
                    zIndex: 0,
                })
            }

            let hit = squares.find((square) => this.hitTest(square, '60%'))

            if (hit) {
                let currentMove = {
                    from: selectedPiece.square,
                    to: hit.id,
                }
                performMove(currentMove, false, callback, zIndexReset)
            } else {
                gsap.to(this.target, {
                    x: 0,
                    y: 0,
                    duration: ANIM_DURATION_1,
                    zIndex: 0,
                })
            }

            gsap.to(this.target, {
                zIndex: 0,
            })
        },
        [
            options.activeColor,
            options.flip,
            options.enableGuide,
            options.draggable,
        ]
    )

    // on drag event handler
    const onDrag = useCallback(
        function () {
            const squares = getDroppables()
            console.log('Drag')

            //getting selected piece from global state
            let hit = undefined
            for (const square of squares) {
                hit = this.hitTest(square, '60%')
                if (hit) {
                    chessUtils.highlightHoverSquare(square)
                } else {
                    chessUtils.removeHoverHighlight(
                        options.enableGuide,
                        square,
                        [selectedPiece.square],
                        previousMove,
                        previousLegalMoves,
                        checkSquare
                    )
                }
            }
        },
        [
            options.activeColor,
            options.flip,
            options.enableGuide,
            options.draggable,
        ]
    )

    //on promotion handler
    function onPromotionHandler(promotionMove) {
        if (!promotionMove) return
        performMove(promotionMove, true, () => {
            selectedPiece = null
            promotionMove = null
        })
    }

    return (
        <>
            <BoardGuides
                size={size}
                backgroundColor={
                    options.guideBackgroundColor
                        ? options.guideBackgroundColor
                        : '#3E291B'
                }
                foregroundColor={
                    options.guideForegroundColor
                        ? options.guideForegroundColor
                        : '#F0D9B5'
                }
                flip={options.flip}
            >
                <div
                    ref={chessboard}
                    style={{
                        position: 'relative',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(8, 1fr)',
                        gridColumn: '2 / 3',
                        width: '100%',
                        aspectRatio: 1,
                    }}
                >
                    <PromotionModal
                        ref={promotionModalRef}
                        flip={options.flip}
                        onPromote={onPromotionHandler}
                        turn={chess.turn()}
                        blackTileColor={
                            options.blackTileColor
                                ? options.blackTileColor
                                : '#8B5D3E'
                        }
                        whiteTileColor={
                            options.whiteTileColor
                                ? options.whiteTileColor
                                : '#F0D9B5'
                        }
                    ></PromotionModal>
                    {((flip) =>
                        flip ? chessUtils.reverseArray(board) : board)(
                        options.flip
                    ).map((rank, rowIndex) => {
                        return ((flip) =>
                            flip ? chessUtils.reverseArray(rank) : rank)(
                            options.flip
                        ).map((square, colIndex) => {
                            return (
                                <Tile
                                    key={chessUtils._2DIndexToSquare(
                                        rowIndex,
                                        colIndex,
                                        options.flip
                                    )}
                                    ref={addDroppable}
                                    colIndex={colIndex}
                                    rowIndex={rowIndex}
                                    options={options}
                                    blackTileColor={
                                        options.blackTileColor
                                            ? options.blackTileColor
                                            : '#8B5D3E'
                                    }
                                    whiteTileColor={
                                        options.whiteTileColor
                                            ? options.whiteTileColor
                                            : '#F0D9B5'
                                    }
                                    payload={square}
                                    onPieceDrag={onDrag}
                                    onPieceDragStart={onDragStart}
                                    onPieceDragEnd={onDragEnd}
                                    onPieceClick={onPieceClick}
                                    bounds={chessboard.current}
                                ></Tile>
                            )
                        })
                    })}
                </div>
            </BoardGuides>
        </>
    )
}

export default memo(ChessBoard)
