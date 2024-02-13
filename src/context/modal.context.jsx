import React, { useState } from 'react'
import Login from '../Components/modals/Login'
import Signup from '../Components/modals/Signup'
import ChangePassword from '../Components/modals/ChangePassword'

// Creating a context object and exporting it
export const ModalContext = React.createContext({
    //setting default values for auto completion
    openLogin: false,
    openSignup: false,
    openChangePassword: false,
    setOpenLogin: () => {},
    setOpenSignup: () => {},
    setOpenChangePassword: () => {},
})

// Creating a provider for the context object and exporting it
export default function ModalContextProvider({ children }) {
    const [openLogin, setOpenLogin] = useState(false)
    const [openSignup, setOpenSignup] = useState(false)
    const [openChangePassword, setOpenChangePassword] = useState(false)
    return (
        <ModalContext.Provider
            value={{
                openLogin,
                openSignup,
                openChangePassword,
                setOpenLogin,
                setOpenSignup,
                setOpenChangePassword,
            }}
        >
            {children}
            {/* Setting up modals*/}
            <Login></Login>
            <Signup></Signup>
            <ChangePassword></ChangePassword>
        </ModalContext.Provider>
    )
}
