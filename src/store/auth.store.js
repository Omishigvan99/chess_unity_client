import { nanoid } from 'nanoid'
import { useEffect, useReducer, useState } from 'react'

//initial auth store state
const initialState = {
    isAuthenticated: false,
    id: null,
    username: null,
    email: null,
    name: null,
    avatar: null,
    accessToken: null,
    refreshToken: null,
}

// constants to be used in the reducer function
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
const SET_USER = 'SET_USER'

//action creators
export const logout = () => ({
    type: LOGOUT,
    payload: null,
})

export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
})

//reducer function to update the state
function reducer(state, action) {
    switch (action.type) {
        case LOGOUT:
            sessionStorage.clear()
            return {
                isAuthenticated: false,
                id: null,
                username: null,
                email: null,
                name: null,
                accessToken: null,
                refreshToken: null,
            }
        case SET_USER:
            return {
                ...state,
                isAuthenticated: true,
                ...action.payload,
            }
        default:
            return state
    }
}

export function useAuthReducer() {
    const [auth, dispatch] = useReducer(reducer, initialState)
    const [guestId] = useState(nanoid(20))

    //get user from session storage
    useEffect(() => {
        const accessToken = sessionStorage.getItem('accessToken')
        const refreshToken = sessionStorage.getItem('refreshToken')
        const username = sessionStorage.getItem('username')
        const email = sessionStorage.getItem('email')
        const name = sessionStorage.getItem('name')
        const avatar = sessionStorage.getItem('avatar')
        const id = sessionStorage.getItem('id')

        if (accessToken && refreshToken && username && email && name) {
            dispatch(
                setUser({
                    id: id,
                    username: username,
                    email: email,
                    name: name,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    avatar: avatar,
                })
            )
        }
    }, [])

    //set user to session storage
    useEffect(() => {
        if (
            !auth.id ||
            !auth.accessToken ||
            !auth.refreshToken ||
            !auth.username ||
            !auth.email ||
            !auth.name
        )
            return
        sessionStorage.setItem('id', auth.id)
        sessionStorage.setItem('accessToken', auth.accessToken)
        sessionStorage.setItem('refreshToken', auth.refreshToken)
        sessionStorage.setItem('username', auth.username)
        sessionStorage.setItem('email', auth.email)
        sessionStorage.setItem('name', auth.name)
        sessionStorage.setItem('avatar', auth.avatar)
    }, [auth])
    return [auth, dispatch, guestId]
}
