<template>
    <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="relative h-48">
            <img :src="media.image" :alt="media.name" class="w-full h-full object-cover" />
            <div class="absolute top-0 right-0 m-2">
                <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-blue-800">
                    {{ media.type }}
                </span>
            </div>
        </div>
        <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900">{{ media.name }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ media.location }}</p>
            <div class="mt-2 flex items-center text-sm text-gray-500">
                <map-pin-icon class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {{ media.address }}
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500">
                <dollar-sign-icon class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {{ formatCurrency(media.price_per_day) }} / día
            </div>
        </div>
        <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="flex justify-end">
                <button @click=goToMediaDetail()
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    Ver detalles
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { MapPinIcon, DollarSignIcon } from 'lucide-vue-next'

const router = useRouter()
const props = defineProps({
    media: {
        type: Object,
        required: true
    }
})

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount)
}

function goToMediaDetail() {
    try {
        if (!props.media?.id) {
            throw new Error('media.id es undefined')
        }
        router.push({ name: 'mediaDetail', params: { id: props.media.id } })
    } catch (err) {
        console.error('Error navegando a detalle de media:', err)
    }
}
</script>
