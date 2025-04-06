<template>
    <div class="min-h-screen bg-gray-200">
        <!-- Navbar -->
        <Navbar :current-view="currentView" @change-view="currentView = $event"
            @toggle-login-modal="showLoginModal = true" />

        <!-- Main content -->
        <main>
            <!-- Home View - Media Listing -->
            <HomeView v-if="currentView === 'home'" :media-list="mediaList" @view-details="viewMediaDetails"
                @book-media="bookMedia" />

            <!-- Media Detail View -->
            <MediaDetailView v-if="currentView === 'mediaDetail' && selectedMedia" :media="selectedMedia"
                @go-back="currentView = 'home'" @book-media="bookMedia" />

            <!-- Booking Form View -->
            <BookingFormView v-if="currentView === 'bookingForm' && selectedMedia" :media="selectedMedia"
                :booking-form="bookingForm" :validation-errors="validationErrors" @go-back="currentView = 'mediaDetail'"
                @submit-booking="submitBooking" @update-dates="updateDates" />

            <!-- Payment View -->
            <PaymentView v-if="currentView === 'payment'" :media="selectedMedia" :booking-form="bookingForm"
                :payment-form="paymentForm" :validation-errors="validationErrors" @go-back="currentView = 'bookingForm'"
                @process-payment="processPayment" />

            <!-- Booking Success View -->
            <BookingSuccessView v-if="currentView === 'bookingSuccess'" :media="selectedMedia"
                @view-bookings="currentView = 'bookings'" />

            <!-- Bookings History View -->
            <BookingsView v-if="currentView === 'bookings'" :bookings="userBookings" @go-home="currentView = 'home'"
                @view-booking-details="viewBookingDetails" />
        </main>

        <!-- Login Modal -->
        <LoginModal v-if="showLoginModal" @close="showLoginModal = false" @login="handleLogin"
            @show-register="showRegisterForm" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Importar componentes
import Navbar from './components/layout/Navbar.vue'
import HomeView from './views/HomeView.vue'
import MediaDetailView from './views/MediaDetailView.vue'
import BookingFormView from './views/BookingFormView.vue'
import PaymentView from './views/PaymentView.vue'
import BookingSuccessView from './views/BookingSuccessView.vue'
import BookingsView from './views/BookingsView.vue'
import LoginModal from './components/common/LoginModal.vue'

// State
const currentView = ref('home')
const selectedMedia = ref(null)
const validationErrors = ref({})
const showLoginModal = ref(false)
const loginForm = ref({
    email: '',
    password: '',
    rememberMe: false
})
const loginErrors = ref({})

// Media data
const mediaList = ref([
    {
        id: 1,
        name: 'Espectacular Reforma',
        type: 'billboard',
        location: 'CDMX',
        address: 'Av. Paseo de la Reforma 222, Juárez',
        description:
            'Espectacular de gran formato ubicado en una de las avenidas más transitadas de la Ciudad de México.',
        dimensions: '12m x 6m',
        image: 'https://images.unsplash.com/photo-1563913553696-82b6ea2642b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        pricePerDay: 5000,
        pricePerWeek: 30000,
        pricePerMonth: 120000,
        availability: [
            1, 2, 3, 4, 5, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21, 25, 26, 27,
            28
        ]
    },
    {
        id: 2,
        name: 'Pantalla Digital Polanco',
        type: 'digital',
        location: 'CDMX',
        address: 'Av. Presidente Masaryk 111, Polanco',
        description:
            'Pantalla LED de alta resolución en la zona comercial más exclusiva de la ciudad.',
        dimensions: '8m x 4m',
        image: 'https://images.unsplash.com/photo-1617295803732-55e27bd659cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        pricePerDay: 8000,
        pricePerWeek: 50000,
        pricePerMonth: 200000,
        availability: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 21, 22, 23, 24, 25, 26, 27, 28
        ]
    },
    {
        id: 3,
        name: 'Metrobús Insurgentes',
        type: 'transit',
        location: 'CDMX',
        address: 'Línea 1 Metrobús, Insurgentes Sur',
        description:
            'Publicidad en unidades de Metrobús de la línea más transitada de la ciudad.',
        dimensions: 'Unidad completa',
        image: 'https://images.unsplash.com/photo-1568438350562-2cae6d394ad0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        pricePerDay: 3000,
        pricePerWeek: 18000,
        pricePerMonth: 70000,
        availability: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28
        ]
    },
    {
        id: 4,
        name: 'Espectacular Periférico',
        type: 'billboard',
        location: 'GDL',
        address: 'Anillo Periférico Norte 1000, Zapopan',
        description:
            'Espectacular de gran visibilidad en la vía más transitada de la zona metropolitana de Guadalajara.',
        dimensions: '14m x 7m',
        image: 'https://images.unsplash.com/photo-1617295803732-55e27bd659cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        pricePerDay: 4000,
        pricePerWeek: 24000,
        pricePerMonth: 95000,
        availability: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28
        ]
    },
    {
        id: 5,
        name: 'Pantalla Digital Andares',
        type: 'digital',
        location: 'GDL',
        address: 'Centro Comercial Andares, Zapopan',
        description:
            'Pantalla digital en el centro comercial más exclusivo de Guadalajara.',
        dimensions: '6m x 3m',
        image: 'https://images.unsplash.com/photo-1563913553696-82b6ea2642b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        pricePerDay: 6000,
        pricePerWeek: 35000,
        pricePerMonth: 140000,
        availability: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28
        ]
    },
    {
        id: 6,
        name: 'Espectacular Constitución',
        type: 'billboard',
        location: 'MTY',
        address: 'Av. Constitución 1500, Centro',
        description:
            'Espectacular ubicado en una de las principales avenidas de Monterrey.',
        dimensions: '10m x 5m',
        image: 'https://images.unsplash.com/photo-1568438350562-2cae6d394ad0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        pricePerDay: 4500,
        pricePerWeek: 27000,
        pricePerMonth: 110000,
        availability: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28
        ]
    }
])

// Booking form
const bookingForm = ref({
    startDate: '',
    endDate: '',
    durationType: 'custom',
    campaignName: '',
    campaignDetails: ''
})

// Payment form
const paymentForm = ref({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
})

// User bookings
const userBookings = ref([])

// Methods
function viewMediaDetails(media) {
    selectedMedia.value = media
    currentView.value = 'mediaDetail'
}

function bookMedia(media) {
    selectedMedia.value = media
    // Reset booking form
    bookingForm.value = {
        startDate: getTomorrow(),
        endDate: getNextWeek(),
        durationType: 'week',
        campaignName: '',
        campaignDetails: ''
    }
    validationErrors.value = {}
    currentView.value = 'bookingForm'
}

function submitBooking() {
    // Validate form
    validationErrors.value = {}

    if (!bookingForm.value.startDate) {
        validationErrors.value.startDate = 'La fecha de inicio es requerida'
    }

    if (!bookingForm.value.endDate) {
        validationErrors.value.endDate = 'La fecha de fin es requerida'
    }

    if (
        new Date(bookingForm.value.startDate) >=
        new Date(bookingForm.value.endDate)
    ) {
        validationErrors.value.endDate =
            'La fecha de fin debe ser posterior a la fecha de inicio'
    }

    if (Object.keys(validationErrors.value).length === 0) {
        // Reset payment form
        paymentForm.value = {
            cardName: '',
            cardNumber: '',
            expiryDate: '',
            cvv: ''
        }
        currentView.value = 'payment'
    }
}

function processPayment() {
    // Validate payment form
    validationErrors.value = {}

    if (
        !paymentForm.value.cardNumber ||
        !/^\d{16}$/.test(paymentForm.value.cardNumber.replace(/\s/g, ''))
    ) {
        validationErrors.value.cardNumber =
            'Ingrese un número de tarjeta válido'
    }

    if (
        !paymentForm.value.expiryDate ||
        !/^\d{2}\/\d{2}$/.test(paymentForm.value.expiryDate)
    ) {
        validationErrors.value.expiryDate =
            'Ingrese una fecha de expiración válida (MM/AA)'
    }

    if (!paymentForm.value.cvv || !/^\d{3,4}$/.test(paymentForm.value.cvv)) {
        validationErrors.value.cvv = 'Ingrese un CVV válido'
    }

    if (Object.keys(validationErrors.value).length === 0) {
        // Create a new booking
        const newBooking = {
            id: userBookings.value.length + 1,
            media: selectedMedia.value,
            startDate: bookingForm.value.startDate,
            endDate: bookingForm.value.endDate,
            campaignName: bookingForm.value.campaignName,
            totalAmount: calculateTotal(),
            status: 'confirmed',
            createdAt: new Date().toISOString()
        }

        userBookings.value.push(newBooking)
        currentView.value = 'bookingSuccess'
    }
}

function viewBookingDetails(booking) {
    // In a real app, this would navigate to a booking detail page
    console.log('View booking details:', booking)
}

function handleLogin(formData) {
    // Simulación de login exitoso
    console.log('Login con:', formData)
    showLoginModal.value = false
}

function showRegisterForm() {
    // En una aplicación real, aquí se mostraría el formulario de registro
    console.log('Mostrar formulario de registro')
}

function updateDates() {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() + 1) // Start tomorrow

    let endDate = new Date(startDate)

    switch (bookingForm.value.durationType) {
        case 'week':
            endDate.setDate(startDate.getDate() + 7)
            break
        case 'twoWeeks':
            endDate.setDate(startDate.getDate() + 14)
            break
        case 'month':
            endDate.setMonth(startDate.getMonth() + 1)
            break
        default:
            // For custom, don't change the end date
            break
    }

    bookingForm.value.startDate = formatDateForInput(startDate)
    bookingForm.value.endDate = formatDateForInput(endDate)
}

function calculateDays() {
    if (!bookingForm.value.startDate || !bookingForm.value.endDate) return 0

    const start = new Date(bookingForm.value.startDate)
    const end = new Date(bookingForm.value.endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
}

function calculateTotal() {
    if (!selectedMedia.value) return 0

    const days = calculateDays()
    return selectedMedia.value.pricePerDay * days
}

// Helper functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount)
}

function formatDate(dateString) {
    if (!dateString) return ''

    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date)
}

function formatDateForInput(date) {
    return date.toISOString().split('T')[0]
}

function getTomorrow() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return formatDateForInput(tomorrow)
}

function getNextWeek() {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 8)
    return formatDateForInput(nextWeek)
}

// Exportar funciones de utilidad para que estén disponibles en los componentes
const utils = {
    formatCurrency,
    formatDate,
    calculateDays,
    calculateTotal
}

// Lifecycle hooks
onMounted(() => {
    // Initialize with default values
    bookingForm.value.startDate = getTomorrow()
    bookingForm.value.endDate = getNextWeek()
})
</script>

<style>
:root {
    --color-primary: #10b981;
    --color-primary-dark: #059669;
}

.bg-primary {
    background-color: var(--color-primary);
}

.bg-primary-dark {
    background-color: var(--color-primary-dark);
}

.text-primary {
    color: var(--color-primary);
}

.border-primary {
    border-color: var(--color-primary);
}

.focus\:ring-primary:focus {
    --tw-ring-color: var(--color-primary);
}

.focus\:border-primary:focus {
    border-color: var(--color-primary);
}

.hover\:bg-primary-dark:hover {
    background-color: var(--color-primary-dark);
}
</style>
