import React, { useState } from 'react'
import Login from '../Components/modals/Login'
import Signup from '../Components/modals/Signup'
import ChangePassword from '../Components/modals/ChangePassword'
import CreateGame from '../Components/modals/CreateGame'
import JoinGame from '../Components/modals/JoinGame'

// Creating a context object and exporting it
export const ModalContext = React.createContext({
    //setting default values for auto completion
    openLogin: false,
    openSignup: false,
    openChangePassword: false,
    openCreateGame: false,
    openJoinGame: false,
    setOpenLogin: () => {},
    setOpenSignup: () => {},
    setOpenChangePassword: () => {},
    setOpenCreateGame: () => {},
    setOpenJoinGame: () => {},
})

// Creating a provider for the context object and exporting it
export default function ModalContextProvider({ children }) {
    const [openLogin, setOpenLogin] = useState(false)
    const [openSignup, setOpenSignup] = useState(false)
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const [openCreateGame, setOpenCreateGame] = useState(false)
    const [openJoinGame, setOpenJoinGame] = useState(false)

    return (
        <ModalContext.Provider
            value={{
                openLogin,
                openSignup,
                openChangePassword,
                openCreateGame,
                openJoinGame,
                setOpenLogin,
                setOpenSignup,
                setOpenChangePassword,
                setOpenCreateGame,
                setOpenJoinGame,
            }}
        >
            {children}
            {/* Setting up modals*/}
            <Login></Login>
            <Signup></Signup>
            <ChangePassword></ChangePassword>
            <CreateGame></CreateGame>
            <JoinGame></JoinGame>
        </ModalContext.Provider>
    )
}
