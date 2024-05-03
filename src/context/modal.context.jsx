import React, { useState } from 'react'
import Login from '../Components/modals/Login'
import Signup from '../Components/modals/Signup'
import ChangePassword from '../Components/modals/ChangePassword'
import CreateGame from '../Components/modals/CreateGame'
import JoinGame from '../Components/modals/JoinGame'
import GameResult from '../Components/modals/GameResult'
import Draw from '../Components/modals/Draw'

// Creating a context object and exporting it
export const ModalContext = React.createContext({
    //setting default values for auto completion
    openLogin: false,
    openSignup: false,
    openChangePassword: false,
    openCreateGame: false,
    openJoinGame: false,
    openGameResult: false,
    openDraw: false,
    setOpenLogin: () => {},
    setOpenSignup: () => {},
    setOpenChangePassword: () => {},
    setOpenCreateGame: () => {},
    setOpenJoinGame: () => {},
    setOpenGameResult: () => {},
    openGameResultModal: () => {},
    openDrawModal: () => {},
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
    const [openDraw, setOpenDraw] = useState({
        open: false,
        onAccept: () => {},
        onReject: () => {},
    })

    function openGameResultModal(
        open,
        { type, color, playerImageUrl, opponentImageUrl, message }
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
            }
        })
    }

    function openDrawModal(open, onAccept, onReject) {
        setOpenDraw(() => {
            return {
                open,
                onAccept,
                onReject,
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
                openDraw,
                setOpenLogin,
                setOpenSignup,
                setOpenChangePassword,
                setOpenCreateGame,
                setOpenJoinGame,
                setOpenGameResult,
                openGameResultModal,
                openDrawModal,
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
