import { createContext } from 'react'
import { useAuthReducer } from "./auth.store"

// initial store state
const initialState = {
    auth: [],
}

//create store context
export const GlobalStore = createContext(initialState)

function StoreProvider({ children }) {
    const authStore = useAuthReducer()
    return (
        <GlobalStore.Provider
            value={{
                auth: authStore,
            }}
        >
            {children}
        </GlobalStore.Provider>
    )
}

export default StoreProvider
