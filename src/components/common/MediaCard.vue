<template>
    <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="relative h-48">
            <img
                :src="media.image"
                :alt="media.name"
                class="w-full h-full object-cover"
            />
            <div class="absolute top-0 right-0 m-2">
                <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getTypeClass(media.type)"
                >
                    {{ getTypeLabel(media.type) }}
                </span>
            </div>
        </div>
        <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900">{{ media.name }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ media.location }}</p>
            <div class="mt-2 flex items-center text-sm text-gray-500">
                <map-pin-icon
                    class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                />
                {{ media.address }}
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500">
                <dollar-sign-icon
                    class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                />
                {{ formatCurrency(media.pricePerDay) }} / día
            </div>
        </div>
        <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="flex justify-between">
                <button
                    @click="$emit('view-details', media)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Ver detalles
                </button>
                <button
                    @click="$emit('book-media', media)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Reservar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { MapPinIcon, DollarSignIcon } from 'lucide-vue-next'

const props = defineProps({
    media: {
        type: Object,
        required: true
    }
})

defineEmits(['view-details', 'book-media'])

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount)
}

function getTypeClass(type) {
    switch (type) {
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
    switch (type) {
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
</script>
