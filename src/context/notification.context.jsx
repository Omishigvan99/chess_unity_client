import { createContext } from 'react'
import { notification } from 'antd'

const initialContext = {
    openNotification: () => {},
}

export const NotificationContext = createContext(initialContext)

function NotificationProvider({ children }) {
    const [api, contextHolder] = notification.useNotification()

    //function to open notification
    function openNotification(type, message, description) {
        api[type]({
            message,
            description,
        })
    }

    return (
        <NotificationContext.Provider value={{ openNotification }}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    )
}
export default NotificationProvider
