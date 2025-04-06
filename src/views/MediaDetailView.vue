<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="mb-4">
            <button
                @click="$emit('go-back')"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                <arrow-left-icon class="h-4 w-4 mr-1" />
                Volver
            </button>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                        {{ media.name }}
                    </h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">
                        {{ media.location }}
                    </p>
                </div>
                <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getTypeClass(media.type)"
                >
                    {{ getTypeLabel(media.type) }}
                </span>
            </div>

            <div class="border-t border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div>
                        <img
                            :src="media.image"
                            :alt="media.name"
                            class="w-full h-64 object-cover rounded-lg"
                        />
                        <div class="mt-4 grid grid-cols-4 gap-2">
                            <img
                                v-for="i in 4"
                                :key="i"
                                :src="media.image"
                                :alt="`Vista ${i}`"
                                class="w-full h-16 object-cover rounded cursor-pointer"
                            />
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <h4 class="text-sm font-medium text-gray-500">
                                Dirección
                            </h4>
                            <p class="mt-1 text-sm text-gray-900">
                                {{ media.address }}
                            </p>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium text-gray-500">
                                Descripción
                            </h4>
                            <p class="mt-1 text-sm text-gray-900">
                                {{ media.description }}
                            </p>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium text-gray-500">
                                Dimensiones
                            </h4>
                            <p class="mt-1 text-sm text-gray-900">
                                {{ media.dimensions }}
                            </p>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium text-gray-500">
                                Precio
                            </h4>
                            <p class="mt-1 text-lg font-bold text-gray-900">
                                {{ formatCurrency(media.pricePerDay) }} / día
                            </p>
                            <p class="mt-1 text-sm text-gray-500">
                                {{ formatCurrency(media.pricePerWeek) }} /
                                semana
                            </p>
                            <p class="mt-1 text-sm text-gray-500">
                                {{ formatCurrency(media.pricePerMonth) }} / mes
                            </p>
                        </div>

                        <div class="pt-4">
                            <h4 class="text-sm font-medium text-gray-500 mb-2">
                                Disponibilidad
                            </h4>
                            <div class="grid grid-cols-7 gap-1 text-center">
                                <div
                                    v-for="day in 7"
                                    :key="`header-${day}`"
                                    class="text-xs font-medium text-gray-500 py-1"
                                >
                                    {{
                                        ['D', 'L', 'M', 'M', 'J', 'V', 'S'][
                                            day - 1
                                        ]
                                    }}
                                </div>
                                <div
                                    v-for="day in 28"
                                    :key="`day-${day}`"
                                    class="text-xs rounded-full h-7 w-7 flex items-center justify-center"
                                    :class="getAvailabilityClass(day)"
                                >
                                    {{ day }}
                                </div>
                            </div>
                            <div
                                class="flex items-center justify-end mt-2 text-xs"
                            >
                                <span
                                    class="inline-block h-3 w-3 rounded-full bg-green-100 mr-1"
                                ></span>
                                <span class="text-gray-500 mr-3"
                                    >Disponible</span
                                >
                                <span
                                    class="inline-block h-3 w-3 rounded-full bg-red-100 mr-1"
                                ></span>
                                <span class="text-gray-500">Reservado</span>
                            </div>
                        </div>

                        <div class="pt-4">
                            <button
                                @click="$emit('book-media', media)"
                                class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                <calendar-icon class="h-4 w-4 mr-2" />
                                Reservar este espacio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ArrowLeftIcon, CalendarIcon } from 'lucide-vue-next'

const props = defineProps({
    media: {
        type: Object,
        required: true
    }
})

defineEmits(['go-back', 'book-media'])

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

function getAvailabilityClass(day) {
    if (!props.media) return ''

    return props.media.availability.includes(day)
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
}
</script>
