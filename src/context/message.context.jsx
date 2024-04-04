import { message } from 'antd'
import { createContext } from 'react'

export const MessageContext = createContext()

/**
 * Provides a context for displaying messages.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 * @returns {ReactNode} The rendered component.
 */
export default function MessageProvider({ children }) {
    const [messageApi, contextHolder] = message.useMessage()

    /**
     * Displays a success message.
     *
     * @param {string} content - The content of the message.
     */
    const success = (content) => {
        messageApi.open({
            content,
            type: 'success',
        })
    }

    /**
     * Displays an error message.
     *
     * @param {string} content - The content of the message.
     */
    const error = (content) => {
        messageApi.open({
            content,
            type: 'error',
        })
    }

    /**
     * Displays a warning message.
     *
     * @param {string} content - The content of the message.
     */
    const warning = (content) => {
        messageApi.open({
            content,
            type: 'warning',
        })
    }

    return (
        <>
            <MessageContext.Provider value={{ success, error, warning }}>
                {contextHolder}
                {children}
            </MessageContext.Provider>
        </>
    )
}
