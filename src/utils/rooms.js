// Importing axios for making HTTP requests
import axios from 'axios'
import { nanoid } from 'nanoid'

/**
 * Asynchronously creates a new room.
 *
 * @param {boolean} isAuthenticated - Indicates whether the user is authenticated.
 * @returns {Promise} - Returns a promise that resolves to the value of the created room.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function createRoom(isAuthenticated) {
    try {
        // Making a GET request to the 'create-room' endpoint of the API
        const response = await axios.get(
            import.meta.env.VITE_API_URL + '/p2p/create-room',
            {
                params: {
                    guest: !isAuthenticated,
                    hostId: !isAuthenticated ? nanoid(20) : null,
                },
            }
        )
        // Returning the value of the created room
        return response.data.value
    } catch (error) {
        // Logging the error to the console
        console.error(error)
    }
}

/**
 * Deletes a room.
 *
 * @param {string} roomId - The ID of the room to be deleted.
 * @param {boolean} isAuthenticated - Indicates whether the user is authenticated.
 * @throws {Error} - Throws an error if the request fails.
 */
export function deleteRoom(roomId, isAuthenticated) {
    try {
        // Making a GET request to the 'delete-room' endpoint of the API
        axios.get(import.meta.env.VITE_API_URL + '/p2p/delete-room', {
            params: {
                roomId: roomId,
                guest: isAuthenticated,
            },
        })
    } catch (error) {
        // Logging the error to the console
        console.error(error)
    }
}

/**
 * Asynchronously joins a room.
 *
 * @param {socket} socket - socket object for emitting events.
 * @param {boolean} isAuthenticated - Indicates whether the user is authenticated.
 * @param {string} data - The room and player details.
 * @returns {Promise} - Returns a promise that resolves to the value of the joined room.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function joinRoom(socket, data) {
    return new Promise((resolve, reject) => {
        try {
            // Emitting the 'join-room' event to the server
            socket.emit('join-room', JSON.stringify(data), (res) => {
                // Resolving the promise with the value of the joined room
                if (res.success) {
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        } catch (error) {
            // Rejecting the promise with the error
            reject(error)
        }
    })
}

/**
 * Asynchronously gets the room details.
 *
 * @param {socket} socket - socket object for emitting events.
 * @param {string} data - The room code and if the user is a guest.
 * @returns {Promise} - Returns a promise that resolves to the value of the room details.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function getRoomDetails(socket, data) {
    return new Promise((resolve, reject) => {
        try {
            // Emitting the 'get-room-details' event to the server
            socket.emit('get-room', JSON.stringify(data), (res) => {
                // Resolving the promise with the value of the room details
                if (res.success) {
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        } catch (error) {
            // Rejecting the promise with the error
            reject(error)
        }
    })
}
