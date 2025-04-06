<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="mb-4">
            <button
                @click="$emit('go-back')"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                <arrow-left-icon class="h-4 w-4 mr-1" />
                Volver al formulario
            </button>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Pago de Reserva
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    Complete los detalles de pago para finalizar su reserva
                </p>
            </div>

            <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
                <form
                    @submit.prevent="$emit('process-payment')"
                    class="space-y-6"
                >
                    <div
                        class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
                    >
                        <div class="sm:col-span-6">
                            <label
                                for="cardName"
                                class="block text-sm font-medium text-gray-700"
                                >Nombre en la tarjeta</label
                            >
                            <div class="mt-1">
                                <input
                                    type="text"
                                    id="cardName"
                                    v-model="paymentForm.cardName"
                                    required
                                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div class="sm:col-span-6">
                            <label
                                for="cardNumber"
                                class="block text-sm font-medium text-gray-700"
                                >Número de tarjeta</label
                            >
                            <div class="mt-1">
                                <input
                                    type="text"
                                    id="cardNumber"
                                    v-model="paymentForm.cardNumber"
                                    required
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <p
                                v-if="validationErrors.cardNumber"
                                class="mt-2 text-sm text-red-600"
                            >
                                {{ validationErrors.cardNumber }}
                            </p>
                        </div>

                        <div class="sm:col-span-3">
                            <label
                                for="expiryDate"
                                class="block text-sm font-medium text-gray-700"
                                >Fecha de expiración</label
                            >
                            <div class="mt-1">
                                <input
                                    type="text"
                                    id="expiryDate"
                                    v-model="paymentForm.expiryDate"
                                    required
                                    placeholder="MM/AA"
                                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <p
                                v-if="validationErrors.expiryDate"
                                class="mt-2 text-sm text-red-600"
                            >
                                {{ validationErrors.expiryDate }}
                            </p>
                        </div>

                        <div class="sm:col-span-3">
                            <label
                                for="cvv"
                                class="block text-sm font-medium text-gray-700"
                                >CVV</label
                            >
                            <div class="mt-1">
                                <input
                                    type="text"
                                    id="cvv"
                                    v-model="paymentForm.cvv"
                                    required
                                    placeholder="123"
                                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <p
                                v-if="validationErrors.cvv"
                                class="mt-2 text-sm text-red-600"
                            >
                                {{ validationErrors.cvv }}
                            </p>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-md">
                        <h4 class="text-base font-medium text-gray-900">
                            Resumen de la reserva
                        </h4>
                        <div class="mt-4 space-y-2">
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-500"
                                    >Espacio:</span
                                >
                                <span class="text-sm text-gray-900">{{
                                    media.name
                                }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-500"
                                    >Periodo:</span
                                >
                                <span class="text-sm text-gray-900"
                                    >{{ formatDate(bookingForm.startDate) }} -
                                    {{ formatDate(bookingForm.endDate) }}</span
                                >
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-500"
                                    >Duración:</span
                                >
                                <span class="text-sm text-gray-900"
                                    >{{ calculateDays() }} días</span
                                >
                            </div>
                            <div class="border-t border-gray-200 pt-2 mt-2">
                                <div class="flex justify-between">
                                    <span
                                        class="text-sm font-medium text-gray-900"
                                        >Total a pagar:</span
                                    >
                                    <span
                                        class="text-sm font-medium text-gray-900"
                                        >{{
                                            formatCurrency(calculateTotal())
                                        }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button
                            type="button"
                            @click="$emit('go-back')"
                            class="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Pagar {{ formatCurrency(calculateTotal()) }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ArrowLeftIcon } from 'lucide-vue-next'

const props = defineProps({
    media: {
        type: Object,
        required: true
    },
    bookingForm: {
        type: Object,
        required: true
    },
    paymentForm: {
        type: Object,
        required: true
    },
    validationErrors: {
        type: Object,
        default: () => ({})
    }
})

defineEmits(['go-back', 'process-payment'])

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

function calculateDays() {
    if (!props.bookingForm.startDate || !props.bookingForm.endDate) return 0

    const start = new Date(props.bookingForm.startDate)
    const end = new Date(props.bookingForm.endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
}

function calculateTotal() {
    if (!props.media) return 0

    const days = calculateDays()
    return props.media.pricePerDay * days
}
</script>
