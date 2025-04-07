<template>
    <div v-if="media != null" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="mb-4">
            <button @click="goBack()"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <arrow-left-icon class="h-4 w-4 mr-1" />
                Volver
            </button>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">{{ media.name }}</h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">{{ media.location }}</p>
                </div>
                <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ media.type }}
                </span>
            </div>

            <div class="border-t border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div>
                        <img :src="media.image" :alt="media.name" class="w-full h-64 object-cover rounded-lg">
                        <div class="mt-4 grid grid-cols-4 gap-2">
                            <img v-for="i in 4" :key="i" :src="media.image" :alt="`Vista ${i}`"
                                class="w-full h-16 object-cover rounded cursor-pointer">
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <h4 class="text-sm font-medium text-gray-500">Dirección</h4>
                            <p class="mt-1 text-sm text-gray-900"> Av.Madero 222, Centro </p>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium text-gray-500">Descripción</h4>
                            <p class="mt-1 text-sm text-gray-900"> Espectacular de gran formato ubicado en una de las
                                avenidas más transitadas de Morelia.</p>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium text-gray-500">Dimensiones</h4>
                            <p class="mt-1 text-sm text-gray-900">12m x 6m</p>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium text-gray-500">Precio</h4>
                            <p class="mt-1 text-lg font-bold text-gray-900">{{ formatCurrency(media.price_per_day) }} /
                                día</p>
                            <p class="mt-1 text-sm text-gray-500">{{ formatCurrency(media.price_per_day * 7) }} / semana
                            </p>
                            <p class="mt-1 text-sm text-gray-500">{{ formatCurrency(media.price_per_day * 28) }} / mes
                            </p>
                        </div>
                        <div class="pt-4">
                            <!-- Selector de mes y año -->
                            <div class="flex justify-between items-center mb-4">
                                <select v-model="currentMonth" class="border p-1 rounded text-sm">
                                    <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}
                                    </option>
                                </select>
                                <select v-model="currentYear" class="border p-1 rounded text-sm">
                                    <option v-for="year in yearRange" :key="year" :value="year">{{ year }}</option>
                                </select>
                            </div>

                            <!-- Calendario -->
                            <div class="grid grid-cols-7 gap-1 text-center">
                                <div v-for="(dayName, i) in ['D', 'L', 'M', 'M', 'J', 'V', 'S']" :key="'header-' + i"
                                    class="text-xs font-medium text-gray-500 py-1">
                                    {{ dayName }}
                                </div>

                                <div v-for="(day, i) in calendarDays" :key="'day-' + i"
                                    class="text-xs rounded-full h-7 w-7 flex items-center justify-center"
                                    :class="getAvailabilityClass(day)">
                                    {{ day || '' }}
                                </div>
                            </div>

                            <!-- Leyenda -->
                            <div class="flex items-center justify-end mt-2 text-xs">
                                <span class="inline-block h-3 w-3 rounded-full bg-green-100 mr-1"></span>
                                <span class="text-gray-500 mr-3">Disponible</span>
                                <span class="inline-block h-3 w-3 rounded-full bg-red-100 mr-1"></span>
                                <span class="text-gray-500">Reservado</span>
                            </div>
                        </div>

                        <div class="pt-4">
                            <button @click="goBookMedia()"
                                class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                <calendar-icon class="h-4 w-4 mr-2" />
                                Reservar este espacio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <InfoModal :isOpen="isInfoModalOpen" :infoModal="infoModal" @close="closeInfoModal" />
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ArrowLeftIcon, CalendarIcon } from 'lucide-vue-next';
import { useMediaStore } from '@/stores/Media/useMediaStore'
import { API_URL } from '@/utils/config'
import InfoModal from '@/components/common/InfoModal.vue'
import { useAuthStore } from '@/stores/Auth/useAuthStore'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

//InfOModal
const isInfoModalOpen = ref(false)
const infoModal = ref({
    title: '',
    message: '',
    type: ''
})

const openInfoModal = () => {
    isInfoModalOpen.value = true
}

const closeInfoModal = () => {
    isInfoModalOpen.value = false
}

const mediaStore = useMediaStore()
const route = useRoute()
const router = useRouter()
const mediaId = route.params.id
const { mediaList, media, status, error, message } = storeToRefs(mediaStore)
// const media = ref(null)
const reserveDaysMedia = ref(null)

onMounted(async () => {
    if (mediaList.value == null) {
        await mediaStore.getMediaList()
    }
    media.value = mediaList.value.find(m => m.id == mediaId)
    if (!media.value) {
        router.push({ name: 'home' })
    }

    reserveDaysMedia.value = getReserveDayMedia(mediaId)
})

const goBack = () => {
    router.go(-1)
}
const goBookMedia = () => {
    if (user.value != null) {
        router.push({ name: 'bookingForm' })
    } else {
        infoModal.value = {
            title: 'Inicia sesión',
            message: 'Debes iniciar sesión para reservar este espacio',
            type: 'info'
        }
        openInfoModal()
    }
}
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

// Obtener la fecha actual
const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

// Día de la semana del primer día del mes
const firstDayOfMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

// Número total de días del mes
const daysInMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

// Generar el calendario con días vacíos al inicio
const calendarDays = computed(() => {
    const days = []
    for (let i = 0; i < firstDayOfMonth.value; i++) {
        days.push(null)
    }
    for (let day = 1; day <= daysInMonth.value; day++) {
        days.push(day)
    }
    return days
})

// Dummy availability (puedes adaptar esto)
function getAvailabilityClass(day) {
    if (!day || !Array.isArray(reserveDaysMedia.value)) return ''

    // Asegura el formato de día y mes con dos dígitos
    const month = String(currentMonth.value + 1).padStart(2, '0')
    const dayFormatted = String(day).padStart(2, '0')

    const dateStr = `${currentYear.value}-${month}-${dayFormatted}`
    // Comprueba si la fecha está en la lista de reservas
    if (reserveDaysMedia.value.includes(dateStr)) {
        return 'bg-red-100'
    }

    return 'bg-green-100'
}

// Generar un rango de años
const yearRange = Array.from({ length: 10 }, (_, i) => today.getFullYear() - 5 + i)

//lista de dias reservador
async function getReserveDayMedia(id) {
    error.value = null
    message.value = null
    status.value = null
    try {
        const response = await fetch(`${API_URL}media/getReservedDays/${id}`, {
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
            reserveDaysMedia.value = data.data
        } else {
            error.value = data.errors
        }
    } catch (err) {
        error.value = err.message
    }
}

</script>
