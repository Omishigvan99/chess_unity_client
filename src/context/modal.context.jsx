import React, { useState } from 'react'
import Login from '../Components/modals/Login'
import Signup from '../Components/modals/Signup'
import ChangePassword from '../Components/modals/ChangePassword'
import CreateGame from '../Components/modals/CreateGame'
import JoinGame from '../Components/modals/JoinGame'
import GameResult from '../Components/modals/GameResult'
import Draw from '../Components/modals/Request'

// Creating a context object and exporting it
export const ModalContext = React.createContext({
    //setting default values for auto completion
    openLogin: false,
    openSignup: false,
    openChangePassword: false,
    openCreateGame: {
        open: false,
        forChannel: 'chessbot',
    },
    openJoinGame: false,
    openGameResult: false,
    openRequest: false,
    setOpenLogin: () => {},
    setOpenSignup: () => {},
    setOpenChangePassword: () => {},
    setOpenCreateGame: () => {},
    setOpenJoinGame: () => {},
    setOpenGameResult: () => {},
    openGameResultModal: () => {},
    openRequestModal: () => {},
    openCreateGameModal: (open, forChannel) => {},
})

/**
 * Provides the modal context to its children components.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 * @returns {ReactNode} The rendered component.
 */
export default function ModalContextProvider({ children }) {
    const [openLogin, setOpenLogin] = useState(false)
    const [openSignup, setOpenSignup] = useState(false)
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const [openCreateGame, setOpenCreateGame] = useState({
        open: false,
        forChannel: 'chessbot',
    })
    const [openJoinGame, setOpenJoinGame] = useState(false)
    const [openGameResult, setOpenGameResult] = useState({
        open: false,
        type: null,
        color: null,
        player: {
            imageUrl: null,
        },
        opponent: {
            imageUrl: null,
        },
    })
    const [openRequest, setOpenRequest] = useState({
        open: false,
        onAccept: () => {},
        onReject: () => {},
    })

    /**
     * Opens the game result modal.
     *
     * @param {boolean} open - Whether the modal should be open or not.
     * @param {object} options - The options for the modal.
     * @param {string} options.type - The type of the game result.
     * @param {string} options.color - The color of the player.
     * @param {string} options.playerImageUrl - The URL of the player's image.
     * @param {string} options.opponentImageUrl - The URL of the opponent's image.
     * @param {string} options.message - The message to be displayed in the modal.
     * @param {function} options.requestRematch - The function to be called when requesting a rematch.
     */
    function openGameResultModal(
        open,
        {
            type,
            color,
            playerImageUrl,
            opponentImageUrl,
            message,
            requestRematch = () => {},
            quit = () => {},
        }
    ) {
        setOpenGameResult(() => {
            return {
                open,
                type,
                color,
                player: {
                    imageUrl: playerImageUrl,
                },
                opponent: {
                    imageUrl: opponentImageUrl,
                },
                message: message,
                requestRematch: requestRematch,
                quit: quit,
            }
        })
    }

    /**
     * Opens the request modal with the specified parameters.
     *
     * @param {boolean} open - Determines whether the modal should be open or closed.
     * @param {string} title - The title of the modal.
     * @param {string} description - The description of the modal.
     * @param {Function} onAccept - The function to be called when the accept button is clicked.
     * @param {Function} onReject - The function to be called when the reject button is clicked.
     */
    function openRequestModal(
        open,
        title,
        description,
        onAccept = () => {},
        onReject = () => {}
    ) {
        setOpenRequest(() => {
            return {
                open,
                title,
                description,
                onAccept,
                onReject,
            }
        })
    }

    /**
     * Opens the create game modal with the specified parameters.
     *
     * @param {boolean} open - Determines whether the modal should be open or closed.
     * @param {string} forChannel - The channel for which the game should be created.
     * @default forChannel - 'chessbot'
     */
    function openCreateGameModal(open, forChannel = 'chessbot') {
        setOpenCreateGame(() => {
            return {
                open,
                forChannel,
            }
        })
    }

    return (
        <ModalContext.Provider
            value={{
                openLogin,
                openSignup,
                openChangePassword,
                openCreateGame,
                openJoinGame,
                openGameResult,
                openRequest,
                setOpenLogin,
                setOpenSignup,
                setOpenChangePassword,
                setOpenCreateGame,
                setOpenJoinGame,
                setOpenGameResult,
                openGameResultModal,
                openRequestModal,
                openCreateGameModal,
            }}
        >
            {children}
            {/* Setting up modals*/}
            <Login></Login>
            <Signup></Signup>
            <ChangePassword></ChangePassword>
            <CreateGame></CreateGame>
            <JoinGame></JoinGame>
            <GameResult></GameResult>
            <Draw></Draw>
        </ModalContext.Provider>
    )
}
