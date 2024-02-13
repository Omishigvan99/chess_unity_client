import axios from 'axios'

// signup handler
export async function signupHandler({ name, username, email, password }) {
    try {
        let response = await axios.post(
            import.meta.env.VITE_API_URL + '/users/register',
            {
                name: name,
                username: username,
                email: email,
                password: password,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        )
        console.log(response.data)
    } catch (error) {
        console.log(error)
        throw new Error('Registration Error')
    }
}

// login handler
export async function loginHandler({ username, email, password }) {
    try {
        let response = await axios.post(
            import.meta.env.VITE_API_URL + '/users/login',
            {
                username: username,
                email: email,
                password: password,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        )
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error)
        throw new Error('Login Error')
    }
}

//logout handler
export async function logoutHandler() {
    try {
        await axios.post(
            import.meta.env.VITE_API_URL + '/users/logout',
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        )
    } catch (error) {
        console.log(error)
        throw new Error('Logout Error')
    }
}

//update handler
export async function updateHandler({ name, email }) {
    try {
        const response = await axios.patch(
            import.meta.env.VITE_API_URL + '/users/update-account',
            {
                name: name,
                email: email,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        )
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error)
        throw new Error('Update Error')
    }
}
