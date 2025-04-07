<template>
    <div v-if="media != null" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="mb-4">
            <button @click="goBack()"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <arrow-left-icon class="h-4 w-4 mr-1" />
                Volver a detalles
            </button>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Reservar Espacio Publicitario</h3>
                <p class="mt-1 max-w-2xl text-base text-gray-500">{{ media.name }} - {{ media.location }}</p>
            </div>
        </div>

        <div class="bg-white shadow overflow-hidden border-gray-100 px-4 py-5 sm:rounded-lg">
            <form @submit.prevent="submitBooking()" class="space-y-6">
                <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div class="sm:col-span-3">
                        <label for="startDate" class="block text-base font-medium text-gray-700">Fecha de inicio</label>
                        <div class="mt-1">
                            <input type="date" id="startDate" v-model="bookingForm.startDate" required
                                class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-base border-gray-300 rounded-md">
                        </div>
                        <p v-if="validationErrors.startDate" class="mt-2 text-base text-red-600">{{
                            validationErrors.startDate }}</p>
                    </div>

                    <div class="sm:col-span-3">
                        <label for="endDate" class="block text-base font-medium text-gray-700">Fecha de fin</label>
                        <div class="mt-1">
                            <input type="date" id="endDate" v-model="bookingForm.endDate" required
                                class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-base border-gray-300 rounded-md">
                        </div>
                        <p v-if="validationErrors.endDate" class="mt-2 text-base text-red-600">{{
                            validationErrors.endDate
                        }}</p>
                    </div>

                    <div class="sm:col-span-6">
                        <label for="campaignName" class="block text-base font-medium text-gray-700">Nombre de la
                            campaña</label>
                        <div class="mt-1">
                            <input type="text" id="campaignName" v-model="bookingForm.campaignName" required
                                class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-base border-gray-300 rounded-md">
                        </div>
                    </div>

                    <div class="sm:col-span-6">
                        <label for="campaignDetails" class="block text-base font-medium text-gray-700">Detalles de la
                            campaña</label>
                        <div class="mt-1">
                            <textarea id="campaignDetails" v-model="bookingForm.campaignDetails" rows="3"
                                class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-base border-gray-300 rounded-md"></textarea>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-md">
                    <h4 class="text-base font-medium text-gray-900">Resumen de la reserva</h4>
                    <div class="mt-4 space-y-2">
                        <div class="flex justify-between">
                            <span class="text-base text-gray-500">Espacio:</span>
                            <span class="text-base text-gray-900">{{ media.name }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-base text-gray-500">Periodo:</span>
                            <span class="text-base text-gray-900">{{ formatDate(bookingForm.startDate) }} - {{
                                formatDate(bookingForm.endDate) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-base text-gray-500">Duración:</span>
                            <span class="text-base text-gray-900">{{ calculateDays() }} días</span>
                        </div>
                        <div class="border-t border-gray-200 pt-2 mt-2">
                            <div class="flex justify-between">
                                <span class="text-base font-medium text-gray-900">Total:</span>
                                <span class="text-base font-medium text-gray-900">{{ formatCurrency(calculateTotal())
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button type="button" @click="goBack()"
                        class="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Cancelar
                    </button>
                    <button type="submit"
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Continuar al pago
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ArrowLeftIcon } from 'lucide-vue-next';
import { useMediaStore } from '@/stores/Media/useMediaStore'
import { useReservationStore } from '@/stores/Booking/useBookingStore'

const mediaStore = useMediaStore()
const { media } = storeToRefs(mediaStore)
const bookingStore = useReservationStore()
const { reservations } = storeToRefs(bookingStore)

const router = useRouter()
const validationErrors = ref({});

const bookingForm = ref({
    startDate: getTomorrow(),
    endDate: getNextWeek(),
    campaignName: '',
    campaignDetails: ''
})

onMounted(async () => {
    bookingStore.clearReservations();
    if (!media.value) {
        router.push({ name: 'home' })
    }
})

const goBack = () => {
    router.go(-1)
}


function formatDateForInput(date) {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return date.getFullYear() + '-' + month + '-' + day;
}

function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateForInput(tomorrow);
}

function getNextWeek() {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    return formatDateForInput(nextWeek);
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function calculateDays() {
    if (!bookingForm.value.startDate || !bookingForm.value.endDate) return 0;

    const start = new Date(bookingForm.value.startDate);
    const end = new Date(bookingForm.value.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays + 1;
}

function calculateTotal() {
    const days = calculateDays();
    return media.value.price_per_day * days;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

function submitBooking() {
    // Validate form
    validationErrors.value = {};

    if (!bookingForm.value.startDate) {
        validationErrors.value.startDate = 'La fecha de inicio es requerida';
    }

    if (!bookingForm.value.endDate) {
        validationErrors.value.endDate = 'La fecha de fin es requerida';
    }

    if (new Date(bookingForm.value.startDate) >= new Date(bookingForm.value.endDate)) {
        validationErrors.value.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    if (Object.keys(validationErrors.value).length === 0) {
        reservations.value = {
            mediaId: media.value.id,
            startDate: bookingForm.value.startDate,
            endDate: bookingForm.value.endDate,
            campaignName: bookingForm.value.campaignName,
            campaignDetails: bookingForm.value.campaignDetails,
            total: calculateTotal()
        }
        router.push({ name: 'paymentForm' })
    }
}
</script>
