import { createContext, useState } from 'react'

// Creating context for theme
export const CustomThemeContext = createContext({
    //setting default values for auto completion
    colorStyle: 'light',
    setColorStyle: () => {},
})

export default function CustomThemeContextProvider({ children }) {
    const [colorStyle, setColorStyle] = useState('light')

    return (
        <CustomThemeContext.Provider value={{ colorStyle, setColorStyle }}>
            {children}
        </CustomThemeContext.Provider>
    )
}
