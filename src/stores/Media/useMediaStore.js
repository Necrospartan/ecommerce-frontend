import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_URL } from '@/utils/config'

export const useMediaStore = defineStore('media', () => {
    const mediaList = ref(null)
    const error = ref(null)
    const message = ref(null)
    const status = ref(null)

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
    return { mediaList, error, message, status, getMediaList }
})
