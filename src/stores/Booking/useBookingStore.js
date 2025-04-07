import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_URL } from '@/utils/config'

export const useReservationStore = defineStore('reservation', () => {
    const reservations = ref(null)
    const error = ref(null)
    const message = ref(null)
    const status = ref(null)
    const clearReservations = () => {
        reservations.value = null
        error.value = null
        message.value = null
        status.value = null
    }

    const addReservation = (reservation) => {
        reservations.value = reservation
    }
    const createReservation = async (reservation) => {
        error.value = null
        message.value = null
        status.value = null
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            if (token) {
                const response = await fetch(
                    `${API_URL}reservation/addReservation`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(reservation)
                    }
                )
                const data = await response.json()
                status.value = response.status
                message.value = data.message
                if (response.ok) {
                    reservations.value = null
                } else {
                    error.value = data.errors
                }
            }
        } catch (err) {
            error.value = err.message
        }
    }
    const getReservations = async () => {
        error.value = null
        message.value = null
        status.value = null
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            if (token) {
                const response = await fetch(
                    `${API_URL}reservation/getReservation`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                const data = await response.json()
                status.value = response.status
                message.value = data.message
                if (response.ok) {
                    reservations.value = data.data.data
                } else {
                    error.value = data.errors
                }
            }
        } catch (err) {
            error.value = err.message
        }
    }
    return {
        reservations,
        error,
        message,
        status,
        createReservation,
        clearReservations,
        addReservation,
        getReservations
    }
})
