import React, { useState } from 'react'
import Login from '../Components/modals/Login'
import Signup from '../Components/modals/Signup'
import ChangePassword from '../Components/modals/ChangePassword'
import CreateGame from '../Components/modals/CreateGame'
import JoinGame from '../Components/modals/JoinGame'
import GameResult from '../Components/modals/GameResult'

// Creating a context object and exporting it
export const ModalContext = React.createContext({
    //setting default values for auto completion
    openLogin: false,
    openSignup: false,
    openChangePassword: false,
    openCreateGame: false,
    openJoinGame: false,
    openGameResult: false,
    setOpenLogin: () => {},
    setOpenSignup: () => {},
    setOpenChangePassword: () => {},
    setOpenCreateGame: () => {},
    setOpenJoinGame: () => {},
    setOpenGameResult: () => {},
    openGameResultModal: () => {},
})

// Creating a provider for the context object and exporting it
export default function ModalContextProvider({ children }) {
    const [openLogin, setOpenLogin] = useState(false)
    const [openSignup, setOpenSignup] = useState(false)
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const [openCreateGame, setOpenCreateGame] = useState(false)
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

    function openGameResultModal(
        open,
        { type, color, playerImageUrl, opponentImageUrl }
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
                setOpenLogin,
                setOpenSignup,
                setOpenChangePassword,
                setOpenCreateGame,
                setOpenJoinGame,
                setOpenGameResult,
                openGameResultModal,
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
        </ModalContext.Provider>
    )
}
