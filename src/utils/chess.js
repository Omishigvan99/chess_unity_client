import gsap from 'gsap'
import { squareStyles } from '../constants/chess'

//method to reverse an array without mutating it
export let reverseArray = (array) => {
    return array.slice().reverse()
}

//convert 2D index to square id
export let _2DIndexToSquare = (row, col, isReverse = false) => {
    if (isReverse) {
        row = 7 - row
        col = 7 - col
    }
    return String.fromCharCode(97 + col) + (8 - row)
}

//convert square id to 2D index
export let squareTo2DIndex = (square, isReverse = false) => {
    let col = square.charCodeAt(0) - 97
    let row = 8 - square[1]
    if (isReverse) {
        col = 7 - col
        row = 7 - row
    }
    return [row, col]
}

//highlight all possible moves for a piece
export const highlightPossibleMoves = (
    isEnabled,
    legalMoves,
    squares,
    callback
) => {
    for (let square of squares) {
        if (legalMoves.includes(square.id)) {
            gsap.to(
                square.children[0],
                isEnabled ? squareStyles.legalMove : squareStyles.default
            )
        }
    }
    callback()
}

//remove all highlights from squares
export const removeHighlights = (squares, previousMove, checkSquare) => {
    let except = [...previousMove]
    for (let square of squares) {
        if (square.id === checkSquare) {
            gsap.to(square.children[0], squareStyles.check)
            continue
        }
        if (except.includes(square.id)) {
            gsap.to(square.children[0], squareStyles.movePlayed)
            continue
        }
        gsap.to(square.children[0], squareStyles.default)
    }
}

//highlight selected square
export const highlightSelectedSquare = (square) => {
    gsap.to(square, squareStyles.selected)
}

//highlight move played
export const highlightMovePlayed = (moves, squares, callback) => {
    for (let square of squares) {
        if (moves.includes(square.id)) {
            gsap.to(square.children[0], squareStyles.movePlayed)
        }
    }
    callback()
}

//hover highlight square
export const highlightHoverSquare = (square) => {
    gsap.to(square.children[0], squareStyles.hover)
}

//remove hover highlight
export const removeHoverHighlight = (
    isEnabled,
    square,
    except = [],
    previousMove,
    previousLegalMoves,
    checkSquare
) => {
    if (previousLegalMoves.includes(square.id)) {
        gsap.to(
            square.children[0],
            isEnabled ? squareStyles.legalMove : squareStyles.default
        )
    } else if (previousMove.includes(square.id)) {
        gsap.to(square.children[0], squareStyles.movePlayed)
    } else if (except.includes(square.id)) {
        gsap.to(square.children[0], squareStyles.selected)
    } else if (square.id === checkSquare) {
        gsap.to(square.children[0], squareStyles.check)
    } else {
        gsap.to(square.children[0], squareStyles.default)
    }
}

//get king square
export const getKingPiece = (kingColor, pieces) => {
    for (let piece of pieces) {
        if (piece.dataset.type === 'k' && piece.dataset.color === kingColor) {
            return piece
        }
    }
}

//function to show check
export const showCheck = (kingColor, pieces, callback) => {
    let piece = getKingPiece(kingColor, pieces)
    let square = piece.offsetParent
    callback(square.id)
    gsap.to(square.children[0], squareStyles.check)
}

// function to remove check
export const removeCheck = (kingColor, pieces, callback) => {
    let piece = getKingPiece(kingColor, pieces)
    let square = piece.offsetParent
    gsap.to(square.children[0], squareStyles.default)
    callback()
}

//function to check if there is promotion
export const isMovePromotional = (type, color, from, to, board) => {
    let [, col1] = squareTo2DIndex(to)
    let [, col2] = squareTo2DIndex(from)

    if (Math.abs(col1 - col2) != 1) return false

    if (type === 'p' && color === 'w' && from[1] === '7' && to[1] === '8')
        return true
    else if (type === 'p' && color === 'b' && from[1] === '2' && to[1] === '1')
        return true
    else return false
}

//function to show promotion modal
export const showPromotionModal = (
    selectedPiece,
    promotionModal,
    currentMove
) => {
    let modal = promotionModal.firstChild
    let isFlipped = promotionModal.dataset.flip === 'true' ? true : false

    if (selectedPiece.color === 'w' && currentMove.to[1] === '8') {
        modal.style.left = `${
            Math.abs(currentMove.to.charCodeAt(0) - 97 - (isFlipped ? 7 : 0)) *
            12.5
        }%`
        modal.style.top = isFlipped ? '50%' : '0%'
    } else {
        modal.style.left = `${
            Math.abs(currentMove.to.charCodeAt(0) - 97 - (isFlipped ? 7 : 0)) *
            12.5
        }%`
        modal.style.top = isFlipped ? '0%' : '50%'
    }

    promotionModal.hidden = false
}

//fucntion to convert list of moves into pgn string
export function movesToPgn(moves) {
    var pgn = ''
    var moveNum = 1
    for (var i = 0; i < moves.length; i++) {
        if (i % 2 == 0) {
            pgn += moveNum + '. '
            moveNum++
        }
        pgn += moves[i] + ' '
    }
    return pgn
}
