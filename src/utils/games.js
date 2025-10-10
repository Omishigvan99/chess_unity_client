// Importing axios for making HTTP requests
import axios from 'axios'

/**
 * Asynchronously saves a game to the server.
 *
 * @param {Object} gameData - The game data to be saved.
 * @param {string} gameData.roomId - The ID of the room where the game was played.
 * @param {string} gameData.gameInstanceId - The unique identifier for this specific game instance.
 * @param {string} gameData.hostId - The ID of the host player.
 * @param {Object} gameData.players - The players object containing white and black player data.
 * @param {string} gameData.board - The final board state in FEN format.
 * @param {Array} gameData.history - The move history of the game.
 * @param {string} gameData.status - The game status ('completed', 'resigned', 'draw').
 * @param {string} [gameData.winner] - The winner of the game ('white', 'black', or null for draw).
 * @param {string} [gameData.draw_reason] - The reason for draw if applicable.
 * @param {string} [gameData.win_reason] - The reason for win if applicable.
 * @param {string} [gameData.type] - The type of game ('p2p', 'bot', etc.).
 * @param {string} [gameData.tournamentId] - The tournament ID if this is a tournament game.
 * @returns {Promise} - Returns a promise that resolves to the saved game data.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function saveGame(gameData) {
    try {
        // Making a POST request to the 'create-game' endpoint of the API
        const response = await axios.post(
            import.meta.env.VITE_API_URL + '/games/create-game',
            gameData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // Include cookies for authentication
            }
        )
        // Return success for both new game creation (201) and duplicate game (200)
        if (response.status === 200) {
            console.log('Game already exists, duplicate save prevented')
        }
        // Returning the saved game data
        return response.data
    } catch (error) {
        // Check if it's a duplicate key error (game already exists)
        if (
            error.response?.status === 409 ||
            error.response?.data?.message?.includes('duplicate') ||
            error.response?.data?.message?.includes('exists')
        ) {
            console.log('Duplicate game save prevented by server')
            return { success: true, message: 'Game already exists' }
        }
        // Logging the error to the console
        console.error('Error saving game:', error)
        throw error
    }
}

/**
 * Asynchronously retrieves a game by its ID.
 *
 * @param {string} gameId - The ID of the game to retrieve.
 * @returns {Promise} - Returns a promise that resolves to the game data.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function getGame(gameId) {
    try {
        // Making a GET request to the 'get-game' endpoint of the API
        const response = await axios.get(
            import.meta.env.VITE_API_URL + `/games/get-game/${gameId}`,
            {
                withCredentials: true, // Include cookies for authentication
            }
        )
        // Returning the game data
        return response.data
    } catch (error) {
        // Logging the error to the console
        console.error('Error retrieving game:', error)
        throw error
    }
}

/**
 * Asynchronously updates a game by its ID.
 *
 * @param {string} gameId - The ID of the game to update.
 * @param {Object} updateData - The data to update the game with.
 * @returns {Promise} - Returns a promise that resolves to the updated game data.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function updateGame(gameId, updateData) {
    try {
        // Making a PATCH request to the 'update-game' endpoint of the API
        const response = await axios.patch(
            import.meta.env.VITE_API_URL + `/games/update-game/${gameId}`,
            updateData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // Include cookies for authentication
            }
        )
        // Returning the updated game data
        return response.data
    } catch (error) {
        // Logging the error to the console
        console.error('Error updating game:', error)
        throw error
    }
}

/**
 * Asynchronously deletes a game by its ID.
 *
 * @param {string} gameId - The ID of the game to delete.
 * @returns {Promise} - Returns a promise that resolves to the deleted game data.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function deleteGame(gameId) {
    try {
        // Making a DELETE request to the 'delete-game' endpoint of the API
        const response = await axios.delete(
            import.meta.env.VITE_API_URL + `/games/delete-game/${gameId}`,
            {
                withCredentials: true, // Include cookies for authentication
            }
        )
        // Returning the deleted game data
        return response.data
    } catch (error) {
        // Logging the error to the console
        console.error('Error deleting game:', error)
        throw error
    }
}
