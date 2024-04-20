import { useGSAP } from '@gsap/react'
import { _2DIndexToSquare } from '../../utils/chess'
import { Draggable } from 'gsap/all'
import { useEffect, useRef } from 'react'
//returns the image path for the piece
const pieceImage = (pieceType) => {
    switch (pieceType) {
        case 'bk':
            return '/defaultPieces/b-king.svg'
        case 'bq':
            return '/defaultPieces/b-queen.svg'
        case 'bb':
            return '/defaultPieces/b-bishop.svg'
        case 'bn':
            return '/defaultPieces/b-knight.svg'
        case 'br':
            return '/defaultPieces/b-rook.svg'
        case 'bp':
            return '/defaultPieces/b-pawn.svg'
        case 'wk':
            return '/defaultPieces/w-king.svg'
        case 'wq':
            return '/defaultPieces/w-queen.svg'
        case 'wb':
            return '/defaultPieces/w-bishop.svg'
        case 'wn':
            return '/defaultPieces/w-knight.svg'
        case 'wr':
            return '/defaultPieces/w-rook.svg'
        case 'wp':
            return '/defaultPieces/w-pawn.svg'
        default:
            return null
    }
}

//returns a Piece component
const Piece = ({
    rowIndex,
    colIndex,
    payload,
    options,
    onDrag,
    onDragStart,
    onDragEnd,
    onClick,
    bounds,
}) => {
    const piece = useRef(null)
    useEffect(() => {
        if (options.clickable === false) return
        piece.current.addEventListener('click', onClick)
        return () => {
            if (piece.current) {
                piece.current.removeEventListener('click', onClick)
            }
        }
    }, [
        onClick,
        options.flip,
        options.clickable,
        options.activeColor,
        options.draggable,
    ])

    //useGSAP hook for draggable
    useGSAP(() => {
        if (options.draggable === false) return
        const draggable = Draggable.create(piece.current, {
            type: 'x,y',
            bounds: bounds,
            onDragStart: onDragStart,
            onDragEnd: onDragEnd,
            onDrag: onDrag,
        })

        if (
            !(draggable[0].target.dataset.color === options.activeColor) &&
            !(
                options.activeColor === '' ||
                options.activeColor === undefined ||
                !(options.activeColor === 'w' || options.activeColor === 'b')
            )
        ) {
            draggable[0].disable()
        }
    }, [
        bounds,
        onDrag,
        onDragStart,
        onDragEnd,
        options.flip,
        options.clickable,
        options.activeColor,
        options.draggable,
    ])
    //determines which piece to render
    let pieceType = payload ? payload.color + payload.type : null

    return (
        <>
            {pieceType ? (
                <div
                    key={'' + rowIndex + colIndex + 'i'}
                    ref={piece}
                    className={'piece'}
                    style={{
                        backgroundImage: `url(${pieceImage(pieceType)})`,
                        ...styles.piece,
                    }}
                    data-type={payload.type}
                    data-color={payload.color}
                    data-square={_2DIndexToSquare(
                        rowIndex,
                        colIndex,
                        options.flip
                    )}
                ></div>
            ) : null}
        </>
    )
}

let styles = {
    piece: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
    },
}

export default Piece
