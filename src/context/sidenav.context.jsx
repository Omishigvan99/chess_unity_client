import React, { useState } from 'react'

// Creating a sidenav context object and exporting it
export const SidenavContext = React.createContext({
    //setting default values for auto completion
    collapsed: false,
    setCollapsed: () => {},
    broken: false,
    setBroken: () => {},
})

export default function SidenavContextProvider({ children }) {
    const [collapsed, setCollapsed] = useState(false)
    const [broken, setBroken] = useState(false)
    return (
        <SidenavContext.Provider
            value={{
                collapsed,
                broken,
                setCollapsed,
                setBroken,
            }}
        >
            {children}
        </SidenavContext.Provider>
    )
}
