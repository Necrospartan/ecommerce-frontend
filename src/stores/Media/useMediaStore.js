import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_URL } from '@/utils/config'

export const useMediaStore = defineStore('media', () => {
    const mediaList = ref(null)
    const error = ref(null)
    const message = ref(null)
    const status = ref(null)
    const media = ref(null)

    const getMediaList = async () => {
        error.value = null
        message.value = null
        status.value = null
        try {
            const response = await fetch(`${API_URL}media/getMedia`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            const data = await response.json()
            status.value = response.status
            message.value = data.message
            if (response.ok) {
                mediaList.value = data.data.data
            } else {
                error.value = data.errors
            }
        } catch (err) {
            error.value = err.message
        }
    }

    const getMedia = async (id) => {
        error.value = null
        message.value = null
        status.value = null
        try {
            const response = await fetch(`${API_URL}media/getMedia/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            const data = await response.json()
            status.value = response.status
            message.value = data.message
            if (response.ok) {
                media.value = data.data
            } else {
                error.value = data.errors
            }
        } catch (err) {
            error.value = err.message
        }
    }

    const addMedia = async (data) => {
        error.value = null
        message.value = null
        status.value = null
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('location', data.location)
        formData.append('type', data.type)
        formData.append('image', data.image)
        formData.append('price_per_day', data.price_per_day)
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            if (token) {
                const response = await fetch(`${API_URL}media/addMedia`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                })
                const responseData = await response.json()
                status.value = response.status
                message.value = responseData.message
                if (response.ok) {
                    media.value = responseData.data
                } else {
                    error.value = responseData.errors
                }
            }
        } catch (err) {
            error.value = err.message
        }
    }

    const updateMedia = async (data, id) => {
        error.value = null
        message.value = null
        status.value = null
        const formData = new FormData()
        if (data.name !== null && data.name !== undefined)
            formData.append('name', data.name)

        if (data.location !== null && data.location !== undefined)
            formData.append('location', data.location)

        if (data.type !== null && data.type !== undefined)
            formData.append('type', data.type)

        if (data.image !== null && data.image !== undefined)
            formData.append('image', data.image)

        if (data.price_per_day !== null && data.price_per_day !== undefined)
            formData.append('price_per_day', data.price_per_day)

        try {
            const token = JSON.parse(localStorage.getItem('token'))
            if (token) {
                const response = await fetch(
                    `${API_URL}media/updateMedia/${id}`,
                    {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: formData
                    }
                )
                const responseData = await response.json()
                status.value = response.status
                message.value = responseData.message
                if (response.ok) {
                    media.value = responseData.data
                } else {
                    error.value = responseData.errors
                }
            }
        } catch (err) {
            error.value = err.message
        }
    }

    const deleteMedia = async (id) => {
        error.value = null
        message.value = null
        status.value = null
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            if (token) {
                const response = await fetch(
                    `${API_URL}media/deleteMedia/${id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                const responseData = await response.json()
                status.value = response.status
                message.value = responseData.message
                if (response.ok) {
                    media.value = responseData.data
                    await getMediaList()
                } else {
                    error.value = responseData.errors
                }
            }
        } catch (err) {
            error.value = err.message
        }
    }
    return {
        mediaList,
        media,
        error,
        message,
        status,
        getMediaList,
        getMedia,
        addMedia,
        updateMedia,
        deleteMedia
    }
})
