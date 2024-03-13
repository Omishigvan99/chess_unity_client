// Importing necessary libraries and components
import { forwardRef } from 'react'
import Piece from './Piece.jsx'
import { _2DIndexToSquare } from '../../utils/chess.js'

// Tile component represents a single tile on the chessboard.
// It uses forwardRef to allow parent components to interact with the DOM node.
const Tile = forwardRef(function Sqaure(
    {
        // Props include indices, options, colors, payload (piece data), event handlers, and bounds for dragging
        colIndex,
        rowIndex,
        options,
        blackTileColor,
        whiteTileColor,
        payload,
        onPieceClick,
        onPieceDrag,
        onPieceDragStart,
        onPieceDragEnd,
        bounds,
    },
    ref
) {
    return (
        <>
            {/* The tile div has an id based on its position and a style based on its color */}
            <div
                id={_2DIndexToSquare(rowIndex, colIndex, options.flip)}
                ref={ref}
                style={{
                    ...styles.container,
                    backgroundColor:
                        (rowIndex + colIndex) % 2 === 0
                            ? whiteTileColor
                            : blackTileColor,
                }}
            >
                {/* The activity indicator shows the possible moves and other possible indication */}
                <div
                    className="square-activity-indicator"
                    style={{
                        ...styles.activityIndicator,
                    }}
                ></div>
                {/* If there's a piece on this tile, render the Piece component */}
                {payload ? (
                    <Piece
                        colIndex={colIndex}
                        rowIndex={rowIndex}
                        payload={payload}
                        options={options}
                        onDrag={onPieceDrag}
                        onDragStart={onPieceDragStart}
                        onDragEnd={onPieceDragEnd}
                        onClick={onPieceClick}
                        bounds={bounds}
                    ></Piece>
                ) : null}
            </div>
        </>
    )
})

// Define the styles for the components
let styles = {
    container: {
        position: 'relative',
        aspectRatio: '1/1',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
    },

    activityIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: '100%',
        width: '100%',
    },
}

// Export the Tile component so it can be used in other files.
export default Tile