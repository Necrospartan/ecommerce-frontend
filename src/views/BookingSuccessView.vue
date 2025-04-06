<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="bg-white shadow sm:rounded-lg">
            <div class="px-4 py-5 sm:p-6 text-center">
                <check-circle-icon class="mx-auto h-12 w-12 text-green-500" />
                <h3 class="mt-2 text-lg font-medium text-gray-900">
                    ¡Reserva completada con éxito!
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                    Su reserva para {{ media.name }} ha sido confirmada.
                </p>
                <div class="mt-6">
                    <button
                        @click="$emit('view-bookings')"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Ver mis reservas
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { CheckCircleIcon } from 'lucide-vue-next'

const props = defineProps({
    media: {
        type: Object,
        required: true
    }
})

defineEmits(['view-bookings'])
</script>
