<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="mb-4">
            <button
                @click="$emit('go-back')"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                <arrow-left-icon class="h-4 w-4 mr-1" />
                Volver a detalles
            </button>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Reservar Espacio Publicitario
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    {{ media.name }} - {{ media.location }}
                </p>
            </div>

            <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
                <form
                    @submit.prevent="$emit('submit-booking')"
                    class="space-y-6"
                >
                    <div
                        class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
                    >
                        <div class="sm:col-span-3">
                            <label
                                for="startDate"
                                class="block text-sm font-medium text-gray-700"
                                >Fecha de inicio</label
                            >
                            <div class="mt-1">
                                <input
                                    type="date"
                                    id="startDate"
                                    v-model="bookingForm.startDate"
                                    required
                                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <p
                                v-if="validationErrors.startDate"
                                class="mt-2 text-sm text-red-600"
                            >
                                {{ validationErrors.startDate }}
                            </p>
                        </div>

                        <div class="sm:col-span-3">
                            <label
                                for="endDate"
                                class="block text-sm font-medium text-gray-700"
                                >Fecha de fin</label
                            >
                            <div class="mt-1">
                                <input
                                    type="date"
                                    id="endDate"
                                    v-model="bookingForm.endDate"
                                    required
                                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <p
                                v-if="validationErrors.endDate"
                                class="mt-2 text-sm text-red-600"
                            >
                                {{ validationErrors.endDate }}
                            </p>
                        </div>

                        <div class="sm:col-span-6">
                            <label
                                for="duration"
                                class="block text-sm font-medium text-gray-700"
                                >Duración</label
                            >
                            <div class="mt-1">
                                <select
                                    id="duration"
                                    v-model="bookingForm.durationType"
                                    required
                                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                    @change="$emit('update-dates')"
                                >
                                    <option value="custom">
                                        Personalizado
                                    </option>
                                    <option value="week">1 Semana</option>
                                    <option value="twoWeeks">2 Semanas</option>
                                    <option value="month">1 Mes</option>
                                </select>
                            </div>
                        </div>

                        <div class="sm:col-span-6">
                            <label
                                for="campaignName"
                                class="block text-sm font-medium text-gray-700"
                                >Nombre de la campaña</label
                            >
                            <div class="mt-1">
                                <input
                                    type="text"
                                    id="campaignName"
                                    v-model="bookingForm.campaignName"
                                    required
                                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div class="sm:col-span-6">
                            <label
                                for="campaignDetails"
                                class="block text-sm font-medium text-gray-700"
                                >Detalles de la campaña</label
                            >
                            <div class="mt-1">
                                <textarea
                                    id="campaignDetails"
                                    v-model="bookingForm.campaignDetails"
                                    rows="3"
                                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                ></textarea>
                            </div>
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
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-500"
                                    >Precio por día:</span
                                >
                                <span class="text-sm text-gray-900">{{
                                    formatCurrency(media.pricePerDay)
                                }}</span>
                            </div>
                            <div class="border-t border-gray-200 pt-2 mt-2">
                                <div class="flex justify-between">
                                    <span
                                        class="text-sm font-medium text-gray-900"
                                        >Total:</span
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
                            Continuar al pago
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
    validationErrors: {
        type: Object,
        default: () => ({})
    }
})

defineEmits(['go-back', 'submit-booking', 'update-dates'])

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
