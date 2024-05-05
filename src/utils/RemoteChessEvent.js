//class for chess remote move event handling
export class RemoteChessEvent {
    #listenersList = []

    //send move to all listeners
    sendMove(chessboardId, move) {
        this.#listenersList.forEach((item) => {
            if (item.event === 'move') {
                item.callback(chessboardId, move)
            }
        })
    }

    //reset board for all listeners
    resetBoard(chessboardId) {
        this.#listenersList.forEach((item) => {
            if (item.event === 'reset') {
                item.callback(chessboardId)
            }
        })
    }

    // registering listeners for events
    on(event, callback) {
        this.#listenersList.push({ event, callback })
    }

    // unregistered all listeners for events
    off() {
        this.#listenersList = []
    }
}
