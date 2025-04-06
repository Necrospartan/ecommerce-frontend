import { ref } from 'vue'
import { API_URL } from '@/utils/config'

export function useAuth() {
    const error = ref(null)
    const message = ref(null)
    const status = ref(null)
    const user = ref(null)

    const login = async (credenctials) => {
        try {
            const response = await fetch(`${API_URL}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credenctials)
            })
            const data = await response.json()
            status.value = response.status
            if (response.ok) {
                localStorage.setItem('token', JSON.stringify(data.data.token))
                user.value = data.data
            } else {
                message.value = data.message
                error.value = data.errors
            }
        } catch (err) {
            error.value = err.message
        }
    }
    const logout = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            if (token) {
                const response = await fetch(`${API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    }
                })
                const data = await response.json()
                status.value = response.status
                if (response.ok) {
                    localStorage.removeItem('token')
                    user.value = null
                } else {
                    error.value = data.message
                }
            }
        } catch (err) {
            error.value = err.message
        }
    }
    const checkAuth = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            if (token) {
                const response = await fetch(`${API_URL}auth/checkAuth`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.access_token}` 
                    }
                })
                const data = await response.json()
                status.value = response.status
                if (response.ok) {
                    user.value = data.data
                } else {
                    localStorage.removeItem('token')
                    error.value = data.message
                }
            }
        } catch (err) {
            error.value = err.message
        }
    }
    return { user, message, status, error, login, logout, checkAuth }
}