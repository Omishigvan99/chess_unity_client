import React, { useState } from 'react'

// Creating a context object and exporting it
export const ModalContext = React.createContext({
    //setting default values for auto completion
    openLogin: false,
    openSignup: false,
    setOpenLogin: () => {},
    setOpenSignup: () => {},
})

// Creating a provider for the context object and exporting it
export default function ModalContextProvider({ children }) {
    const [openLogin, setOpenLogin] = useState(false)
    const [openSignup, setOpenSignup] = useState(false)
    return (
        <ModalContext.Provider
            value={{
                openLogin,
                openSignup,
                setOpenLogin,
                setOpenSignup,
            }}
        >
            {children}
        </ModalContext.Provider>
    )
}
