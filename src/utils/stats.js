// Importing axios for making HTTP requests
import axios from 'axios'

/**
 * Asynchronously retrieves player statistics from the server.
 *
 * @param {string} playerId - The ID of the player to get stats for.
 * @returns {Promise} - Returns a promise that resolves to the player stats data.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function getPlayerStats(playerId) {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/games/stats/player/${playerId}`,
            {
                withCredentials: true, // Include cookies for authentication
            }
        )
        return response.data
    } catch (error) {
        console.error('Error retrieving player stats:', error)
        throw error
    }
}

/**
 * Asynchronously retrieves global game statistics from the server.
 *
 * @returns {Promise} - Returns a promise that resolves to the global stats data.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function getGlobalStats() {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/games/stats/global`,
            {
                withCredentials: true, // Include cookies for authentication
            }
        )
        return response.data
    } catch (error) {
        console.error('Error retrieving global stats:', error)
        throw error
    }
}
