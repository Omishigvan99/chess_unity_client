import axios from 'axios'

// profile pic upload function
export async function uploadProfileImage({ file }) {
    try {
        const formData = new FormData()
        formData.append('avatar', file)
        const response = await axios.patch(
            import.meta.env.VITE_API_URL + '/users/avatar',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            }
        )
        return response.data
    } catch (error) {
        console.log(error)
        throw new Error(error.response.data.message)
    }
}
