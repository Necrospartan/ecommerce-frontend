<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Mis Reservas</h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">Historial de espacios publicitarios reservados</p>
                </div>
            </div>

            <div class="border-t border-gray-200">
                <div v-if="reservations == null || reservations.length === 0" class="text-center py-12">
                    <calendar-icon class="mx-auto h-12 w-12 text-gray-400" />
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No tienes reservas</h3>
                    <p class="mt-1 text-sm text-gray-500">Comienza reservando un espacio publicitario.</p>
                    <div class="mt-6">
                        <button @click="gohome()"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Explorar espacios
                        </button>
                    </div>
                </div>

                <ul v-else role="list" class="divide-y divide-gray-200">
                    <li v-for="booking in bookings" :key="booking.id" class="px-4 py-4 sm:px-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                                    <img :src="booking.media.image" :alt="booking.media.name"
                                        class="h-full w-full object-cover">
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">{{ booking.media.name }}</div>
                                    <div class="text-sm text-gray-500">{{ booking.media.location }}</div>
                                </div>
                            </div>
                            <div class="ml-2 flex-shrink-0 flex">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="getBookingStatusClass(booking.payment_status)">
                                    {{ getBookingStatusLabel(booking.payment_status) }}
                                </span>
                            </div>
                        </div>
                        <div class="mt-2 sm:flex sm:justify-between">
                            <div class="sm:flex">
                                <div class="flex items-center text-sm text-gray-500">
                                    <calendar-icon class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                    {{ formatDate(booking.start_date
                                    ) }} - {{ formatDate(booking.end_date) }}
                                </div>
                            </div>
                            <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <dollar-sign-icon class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {{ formatCurrency(booking.total_price) }}
                            </div>
                        </div>
                        <div class="mt-2 flex justify-end">
                            <button @click="openBookingDetailsModal(booking)"
                                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Ver detalles
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <BookingDetailsModal :isOpen="isBookingDetailsModalOpen" :booking="selectedBooking"
        @close="closeBookingDetailsModal" />
</template>

<script setup>
import { CalendarIcon, DollarSignIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useReservationStore } from '@/stores/Booking/useBookingStore'
import { onMounted, ref } from 'vue'
import { useMediaStore } from '@/stores/Media/useMediaStore'
import { useAuthStore } from '@/stores/Auth/useAuthStore'
import BookingDetailsModal from '@/components/common/BookingDetailsModal.vue'

const bookingStore = useReservationStore()
const { reservations } = storeToRefs(bookingStore)
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const router = useRouter()

const mediaStore = useMediaStore()
const { mediaList } = storeToRefs(mediaStore)
const bookings = ref([])
const selectedBooking = ref(null)

const isBookingDetailsModalOpen = ref(false)

onMounted(async () => {
    if (user.value == null)
        gohome()
    loadBookingsWithMediaDetails()
})

async function loadBookingsWithMediaDetails() {
    bookings.value = []
    await bookingStore.getReservations()
    if (mediaList.value == null)
        await mediaStore.getMediaList()
    for (const booking of reservations.value) {
        const media = mediaList.value.find(media => media.id === booking.media_id)
        if (media) {
            booking.media = media
        }
        bookings.value.push(booking)
    }
}

function gohome() {
    router.push({ name: 'home' })
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
}

function getBookingStatusClass(status) {
    switch (status) {
        case 'pagado':
            return 'bg-green-100 text-green-800'
        case 'procesando':
            return 'bg-yellow-100 text-yellow-800'
        case 'cancelado':
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

function getBookingStatusLabel(status) {
    switch (status) {
        case 'pagado':
            return 'Pagado'
        case 'procesando':
            return 'Procesando'
        case 'cancelado':
            return 'Cancelada'
        default:
            return status
    }
}

async function openBookingDetailsModal(booking) {
    await loadBookingsWithMediaDetails()
    selectedBooking.value = bookings.value.find(b => b.id === booking.id)
    isBookingDetailsModalOpen.value = true
}

function closeBookingDetailsModal() {
    isBookingDetailsModalOpen.value = false
    selectedBooking.value = null
}
</script>
