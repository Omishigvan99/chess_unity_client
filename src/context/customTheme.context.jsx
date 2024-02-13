import { createContext, useEffect, useState } from 'react'

// Creating context for theme
export const CustomThemeContext = createContext({
    //setting default values for auto completion
    colorStyle: 'light',
    setColorStyle: () => {},
})

export default function CustomThemeContextProvider({ children }) {
    const [colorStyle, setColorStyle] = useState(null)

    //get theme from local storage
    useEffect(() => {
        const theme = localStorage.getItem('theme')
        if (!theme) return
        setColorStyle(theme)
    }, [])

    //set theme to local storage
    useEffect(() => {
        if(!colorStyle) return
        localStorage.setItem('theme', colorStyle)
    }, [colorStyle])

    return (
        <CustomThemeContext.Provider value={{ colorStyle, setColorStyle }}>
            {children}
        </CustomThemeContext.Provider>
    )
}
