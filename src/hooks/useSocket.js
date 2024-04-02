import { useState } from 'react'
import { io } from 'socket.io-client'
export function useSocket(namespace = '/') {
    const [socket, _] = useState(
        io(import.meta.env.VITE_SOCKET_URL + namespace)
    )
    return socket
}
