<template>
    <div v-if="media != null && reservations != null" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="mb-4">
            <button @click="goBack()"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <arrow-left-icon class="h-4 w-4 mr-1" />
                Volver al formulario
            </button>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Pago de Reserva</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Complete los detalles de pago para finalizar su reserva
                </p>
            </div>

            <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
                <form @submit.prevent="processPayment()" class="space-y-6">
                    <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div class="sm:col-span-6">
                            <label for="cardName" class="block text-sm font-medium text-gray-700">Nombre en la
                                tarjeta</label>
                            <div class="mt-1">
                                <input type="text" id="cardName" v-model="paymentForm.cardName" required
                                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md">
                            </div>
                        </div>

                        <div class="sm:col-span-6">
                            <label for="cardNumber" class="block text-sm font-medium text-gray-700">Número de
                                tarjeta</label>
                            <div class="mt-1">
                                <input type="text" id="cardNumber" v-model="paymentForm.cardNumber" required
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md">
                            </div>
                            <p v-if="validationErrors.cardNumber" class="mt-2 text-sm text-red-600">{{
                                validationErrors.cardNumber }}</p>
                        </div>

                        <div class="sm:col-span-3">
                            <label for="expiryDate" class="block text-sm font-medium text-gray-700">Fecha de
                                expiración</label>
                            <div class="mt-1">
                                <input type="text" id="expiryDate" v-model="paymentForm.expiryDate" required
                                    placeholder="MM/AA"
                                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md">
                            </div>
                            <p v-if="validationErrors.expiryDate" class="mt-2 text-sm text-red-600">{{
                                validationErrors.expiryDate }}</p>
                        </div>

                        <div class="sm:col-span-3">
                            <label for="cvv" class="block text-sm font-medium text-gray-700">CVV</label>
                            <div class="mt-1">
                                <input type="text" id="cvv" v-model="paymentForm.cvv" required placeholder="123"
                                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md">
                            </div>
                            <p v-if="validationErrors.cvv" class="mt-2 text-sm text-red-600">{{ validationErrors.cvv }}
                            </p>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-md">
                        <h4 class="text-base font-medium text-gray-900">Resumen de la reserva</h4>
                        <div class="mt-4 space-y-2">
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-500">Espacio:</span>
                                <span class="text-sm text-gray-900">{{ media.name }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-500">Periodo:</span>
                                <span class="text-sm text-gray-900">{{ formatDate(reservations.startDate) }} - {{
                                    formatDate(reservations.endDate) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-500">Duración:</span>
                                <span class="text-sm text-gray-900">{{ calculateDays() }} días</span>
                            </div>
                            <div class="border-t border-gray-200 pt-2 mt-2">
                                <div class="flex justify-between">
                                    <span class="text-sm font-medium text-gray-900">Total a pagar:</span>
                                    <span class="text-sm font-medium text-gray-900">{{ formatCurrency(calculateTotal())
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button type="button" @click="goBack()"
                            class="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Cancelar
                        </button>
                        <button type="submit"
                            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Pagar {{ formatCurrency(calculateTotal()) }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <InfoModal :isOpen="isInfoModalOpen" :infoModal="infoModal" @close="closeInfoModal" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from 'lucide-vue-next'
import { useMediaStore } from '@/stores/Media/useMediaStore'
import { useReservationStore } from '@/stores/Booking/useBookingStore'
import InfoModal from '@/components/common/InfoModal.vue'
import Decimal from 'decimal.js'

const mediaStore = useMediaStore()
const { media } = storeToRefs(mediaStore)
const bookingStore = useReservationStore()
const { reservations, message, status } = storeToRefs(bookingStore)
const router = useRouter()
const validationErrors = ref({})
const paymentForm = ref({})

const isInfoModalOpen = ref(false)
const infoModal = ref({
    title: '',
    message: '',
    type: ''
})

onMounted(async () => {
    if (!media.value) {
        router.push({ name: 'home' })
    }
    if (!reservations.value) {
        goBack()
    }
})

const goBack = () => {
    router.go(-1)
}


function formatDate(dateString) {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
}

function calculateDays() {
    if (!reservations.value.startDate || !reservations.value.endDate) return 0

    const start = new Date(reservations.value.startDate)
    const end = new Date(reservations.value.endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays + 1
}

function calculateTotal() {
    const days = calculateDays()
    return media.value.price_per_day * days
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}

async function processPayment() {
    validationErrors.value = {}
    if (!paymentForm.value.cardName) {
        validationErrors.value.cardName = 'El nombre en la tarjeta es obligatorio.'
    }
    if (!paymentForm.value.cardNumber || !/^\d{16}$/.test(paymentForm.value.cardNumber)) {
        validationErrors.value.cardNumber = 'El número de tarjeta debe tener 16 dígitos.'
    }
    if (!paymentForm.value.expiryDate || !/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(paymentForm.value.expiryDate)) {
        validationErrors.value.expiryDate = 'La fecha de expiración debe estar en formato MM/AA.'
    }
    if (!paymentForm.value.cvv || !/^\d{3}$/.test(paymentForm.value.cvv)) {
        validationErrors.value.cvv = 'El CVV debe tener 3 dígitos.'
    }

    if (Object.keys(validationErrors.value).length === 0) {
        const unitPrice = new Decimal(media.value.price_per_day)
        const quantity = new Decimal(calculateDays())
        const total = unitPrice.mul(quantity)
        const reservationData = {
            media_id: media.value.id,
            start_date: reservations.value.startDate,
            end_date: reservations.value.endDate,
            total_price: total
        }
        await bookingStore.createReservation(reservationData)
        const title = (status.value < 202 ? 'Exito' : 'Error')
        const type = (status.value < 202 ? 'success' : 'error')
        infoModal.value = {
            title: title,
            message: message.value,
            type: type
        }
        openInfoModal()
    }
}

//InfOModal

const openInfoModal = () => {
    isInfoModalOpen.value = true
}

const closeInfoModal = () => {
    isInfoModalOpen.value = false
    if (infoModal.value.type == 'success')
        router.push({ name: 'home' })
}
</script>
