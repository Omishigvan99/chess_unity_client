import { forwardRef } from 'react'
// Piece component that takes a source and renders an image
function Piece({ src }) {
    return (
        <img
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
            }}
            src={src}
            alt=""
        />
    )
}

// PromotionModal component that allows the user to promote a pawn
const PromotionModal = forwardRef(
    (
        // Props include turn, flip, onPromote function, and colors for the tiles
        { turn, flip, onPromote = () => {}, blackTileColor, whiteTileColor },
        ref
    ) => {
        // clickHandler function that handles the promotion of the pawn
        let clickHandler = (event, piece) => {
            // Get the from and to squares from the dataset
            const from =
                event.target.offsetParent.offsetParent.offsetParent.dataset
                    .promotionFrom
            const to =
                event.target.offsetParent.offsetParent.offsetParent.dataset
                    .promotionTo

            // Call the onPromote function with the move details
            onPromote({
                from: from,
                to: to,
                promotion: piece,
            })

            // Hide the modal after the promotion
            event.target.offsetParent.offsetParent.offsetParent.hidden = true
        }

        // Render the modal with the promotion options
        return (
            <div ref={ref} style={styles.container} hidden data-flip={flip}>
                <div style={{ ...styles.modal }}>
                    {/* Render the promotion options for each piece */}
                    <div
                        style={{
                            ...styles.piece,
                            backgroundColor: whiteTileColor,
                        }}
                        onClick={(event) => clickHandler(event, 'q')}
                    >
                        <Piece src={`/defaultPieces/${turn}-queen.svg`}></Piece>
                    </div>
                    <div
                        style={{
                            ...styles.piece,
                            backgroundColor: blackTileColor,
                        }}
                        onClick={(event) => clickHandler(event, 'r')}
                    >
                        <Piece src={`/defaultPieces/${turn}-rook.svg`}></Piece>
                    </div>
                    <div
                        style={{
                            ...styles.piece,
                            backgroundColor: whiteTileColor,
                        }}
                        onClick={(event) => clickHandler(event, 'b')}
                    >
                        <Piece
                            src={`/defaultPieces/${turn}-bishop.svg`}
                        ></Piece>
                    </div>
                    <div
                        style={{
                            ...styles.piece,
                            backgroundColor: blackTileColor,
                        }}
                        onClick={(event) => clickHandler(event, 'n')}
                    >
                        <Piece
                            src={`/defaultPieces/${turn}-knight.svg`}
                        ></Piece>
                    </div>
                </div>
            </div>
        )
    }
)

// Export the PromotionModal component
export default PromotionModal

// Define the styles for the components
let styles = {
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1,
    },
    modal: {
        position: 'absolute',
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        backgroundColor: 'white',
        minWidth: '12.5%',
        minHeight: '50%',
    },
    piece: {
        position: 'relative',
        width: '100%',
    },
}
