<template>
    <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <h1 class="text-xl font-bold text-primary">
                            AdSpaceBook
                        </h1>
                    </div>
                    <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <a href="#"
                            class="border-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            :class="{
                                'border-primary text-gray-900':
                                    currentView === 'home',
                                'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700':
                                    currentView !== 'home'
                            }" @click.prevent="$emit('change-view', 'home')">
                            Espacios
                        </a>
                        <a href="#"
                            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            :class="{
                                'border-primary text-gray-900':
                                    currentView === 'bookings',
                                'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700':
                                    currentView !== 'bookings'
                            }" @click.prevent="$emit('change-view', 'bookings')">
                            Mis Reservas
                        </a>
                    </div>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:items-center">
                    <button @click="$emit('toggle-login-modal')"
                        class="mr-3 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Iniciar sesión
                    </button>
                    <button
                        class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        <span class="sr-only">Ver notificaciones</span>
                        <bell-icon class="h-6 w-6" />
                    </button>
                    <div class="ml-3 relative">
                        <div>
                            <button
                                class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                <span class="sr-only">Abrir menú de usuario</span>
                                <div
                                    class="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                                    <user-icon class="h-5 w-5" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="-mr-2 flex items-center sm:hidden">
                    <button @click="mobileMenuOpen = !mobileMenuOpen"
                        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                        <span class="sr-only">Abrir menú principal</span>
                        <menu-icon v-if="!mobileMenuOpen" class="block h-6 w-6" />
                        <x-icon v-else class="block h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue'
import { BellIcon, LogInIcon, MenuIcon, UserIcon, XIcon } from 'lucide-vue-next'

defineProps({
    currentView: {
        type: String,
        required: true
    }
})

defineEmits(['change-view', 'toggle-login-modal'])

const mobileMenuOpen = ref(false)
</script>
