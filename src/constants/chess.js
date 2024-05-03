//globals
export const ANIM_DURATION_1 = 0.1
export const ANIM_DURATION_2 = 0.2

//square activity styles
export const squareStyles = {
    selected: {
        backgroundColor: 'rgb(5, 224, 233, 1)',
        borderRadius: '0%',
        duration: ANIM_DURATION_1,
        height: '100%',
        width: '100%',
    },
    movePlayed: {
        backgroundColor: 'rgba(255, 255, 0, 1)',
        borderRadius: '0%',
        duration: ANIM_DURATION_1,
        height: '100%',
        width: '100%',
    },
    legalMove: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '50%',
        duration: ANIM_DURATION_1,
        height: '60%',
        width: '60%',
    },
    hover: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '0%',
        duration: ANIM_DURATION_1,
        height: '100%',
        width: '100%',
    },
    default: {
        backgroundColor: null,
        borderRadius: '0%',
        duration: ANIM_DURATION_1,
        height: '100%',
        width: '100%',
    },
    check: {
        backgroundColor: 'rgba(255, 0, 0, 1)',
        borderRadius: '0%',
        duration: ANIM_DURATION_1,
        height: '100%',
        width: '100%',
    },
}

// draw, and wins message
export const DRAW_STALEMATE = 'Draw by Stalemate'
export const DRAW_INSUFFICIENT_MATERIAL = 'Draw by Insufficient Material'
export const DRAW_50_MOVE_RULE = 'Draw by 50 Move Rule'
export const DRAW_THREEFOLD_REPETITION = 'Draw by Threefold Repetition'
export const DRAW_AGREED = 'Draw by Agreement'
export const WIN = 'Win by Checkmate'
export const WIN_RESIGNATION = 'Win by Resignation'
export const LOSS_RESIGNATION = 'Loss by Resignation'
export const LOSS_CHECKMATE = 'Loss by Checkmate'
