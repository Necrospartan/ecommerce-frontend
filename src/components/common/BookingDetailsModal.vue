<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
        aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div class="fixed inset-0 bg-white/30 backdrop-blur-xs" aria-hidden="true" @click="closeModal"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
            </span>

            <!-- Modal panel -->
            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Detalles de la Reserva #{{ booking.id }}
                                </h3>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="getPaymentStatusClass(booking.payment_status)">
                                    {{ getPaymentStatusLabel(booking.payment_status) }}
                                </span>
                            </div>

                            <div class="border-t border-gray-200 pt-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <!-- Información del medio -->
                                    <div>
                                        <div class="aspect-w-16 aspect-h-9 mb-4">
                                            <img :src="booking.media.image" :alt="booking.media.name"
                                                class="object-cover rounded-lg shadow-sm">
                                        </div>
                                        <h4 class="text-base font-medium text-gray-900">{{ booking.media.name }}</h4>
                                        <p class="text-sm text-gray-500">{{ getLocationName(booking.media.location) }}
                                        </p>
                                        <div class="mt-2 flex items-center">
                                            <span
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                :class="getTypeClass(booking.media.type)">
                                                {{ getTypeLabel(booking.media.type) }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Información de la reserva -->
                                    <div class="space-y-4">
                                        <div>
                                            <h4 class="text-sm font-medium text-gray-500">ID de Reserva</h4>
                                            <p class="mt-1 text-base text-gray-900">{{ booking.id }}</p>
                                        </div>

                                        <div>
                                            <h4 class="text-sm font-medium text-gray-500">Periodo</h4>
                                            <div class="flex items-center mt-1">
                                                <calendar-icon class="h-4 w-4 text-gray-400 mr-1" />
                                                <span class="text-base text-gray-900">
                                                    {{ formatDate(booking.start_date) }} - {{
                                                        formatDate(booking.end_date) }}
                                                </span>
                                            </div>
                                            <p class="text-sm text-gray-500 mt-1">{{ calculateDays(booking) }} días</p>
                                        </div>

                                        <div>
                                            <h4 class="text-sm font-medium text-gray-500">Precio por día</h4>
                                            <p class="mt-1 text-base text-gray-900">{{
                                                formatCurrency(booking.media.price_per_day) }}</p>
                                        </div>

                                        <div>
                                            <h4 class="text-sm font-medium text-gray-500">Monto Total</h4>
                                            <p class="mt-1 text-xl font-bold text-gray-900">{{
                                                formatCurrency(booking.total_price) }}</p>
                                        </div>

                                        <div>
                                            <h4 class="text-sm font-medium text-gray-500">Fecha de Reserva</h4>
                                            <p class="mt-1 text-base text-gray-900">{{ formatDate(booking.created_at) }}
                                            </p>
                                        </div>

                                        <div class="pt-2">
                                            <div class="flex items-center">
                                                <component :is="getPaymentStatusIcon(booking.payment_status)"
                                                    class="h-5 w-5 mr-2"
                                                    :class="getPaymentStatusIconClass(booking.payment_status)" />
                                                <span class="text-sm text-gray-700">{{
                                                    getPaymentStatusMessage(booking.payment_status) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Información adicional -->
                            <div class="mt-6 border-t border-gray-200 pt-4">
                                <h4 class="text-sm font-medium text-gray-500 mb-2">Información Importante</h4>
                                <div class="bg-yellow-50 p-4 rounded-md">
                                    <div class="flex">
                                        <div class="flex-shrink-0">
                                            <info-icon class="h-5 w-5 text-yellow-400" />
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm text-yellow-700">
                                                Las cancelaciones realizadas con más de 7 días de anticipación recibirán
                                                un reembolso del 80%.
                                                Cancelaciones con menos de 7 días recibirán un reembolso del 50%.
                                                No hay reembolsos para cancelaciones con menos de 48 horas de
                                                anticipación.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                        @click="closeModal">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { CalendarIcon, InfoIcon, CheckCircleIcon, ClockIcon, XCircleIcon, AlertCircleIcon } from 'lucide-vue-next'

defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    booking: {
        type: [Object, null],
        required: true
    }
})

const emit = defineEmits(['close'])

const closeModal = () => {
    emit('close')
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
}

function calculateDays(booking) {
    if (!booking.start_date || !booking.end_date) return 0

    const start = new Date(booking.start_date)
    const end = new Date(booking.end_date)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
}

function getPaymentStatusClass(status) {
    switch (status.toLowerCase()) {
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

function getPaymentStatusLabel(status) {
    switch (status.toLowerCase()) {
        case 'pagado':
            return 'Pagado'
        case 'procesando':
            return 'Procesando'
        case 'cancelado':
            return 'Cancelado'
        default:
            return status
    }
}

function getPaymentStatusIcon(status) {
    switch (status.toLowerCase()) {
        case 'pagado':
            return CheckCircleIcon
        case 'procesando':
            return ClockIcon
        case 'cancelado':
            return XCircleIcon
        default:
            return AlertCircleIcon
    }
}

function getPaymentStatusIconClass(status) {
    switch (status.toLowerCase()) {
        case 'pagado':
            return 'text-green-500'
        case 'procesando':
            return 'text-yellow-500'
        case 'cancelado':
            return 'text-red-500'
        default:
            return 'text-gray-500'
    }
}

function getPaymentStatusMessage(status) {
    switch (status.toLowerCase()) {
        case 'pagado':
            return 'Pago procesado correctamente'
        case 'procesando':
            return 'Pago en proceso'
        case 'cancelado':
            return 'Reserva cancelada'
        default:
            return 'Estado desconocido'
    }
}

function getTypeClass(type) {
    switch (type.toLowerCase()) {
        case 'billboard':
            return 'bg-blue-100 text-blue-800'
        case 'digital':
            return 'bg-green-100 text-green-800'
        case 'transit':
            return 'bg-yellow-100 text-yellow-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

function getTypeLabel(type) {
    switch (type.toLowerCase()) {
        case 'billboard':
            return 'Espectacular'
        case 'digital':
            return 'Digital'
        case 'transit':
            return 'Transporte'
        default:
            return type
    }
}

function getLocationName(locationCode) {
    const locations = {
        'CDMX': 'Ciudad de México',
        'GDL': 'Guadalajara',
        'MTY': 'Monterrey',
        'MOR': 'Morelia',
    }

    return locations[locationCode] || locationCode
}

</script>
