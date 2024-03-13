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

    // registering listeners for events
    on(event, callback) {
        this.#listenersList.push({ event, callback })
    }

    // unregistering all listeners for events
    off() {
        this.#listenersList = []
    }
}
