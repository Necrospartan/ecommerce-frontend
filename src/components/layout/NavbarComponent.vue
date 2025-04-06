<template>
    <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <h1 class="text-2xl font-bold text-primary">{{ companyName }}</h1>
                    </div>
                    <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <router-link to='/' :class="[
                            'border-primary text-gray-900 inline-flex items-center px-1 pt-1  text-base font-medium hover:text-gray-600',
                            $route.path === '/' ? 'border-primary border-b-2' : ''
                        ]">
                            Espacios
                        </router-link>
                        <router-link v-if="user" to="/reservations" :class="[
                            'border-primary text-gray-900 inline-flex items-center px-1 pt-1  text-base font-medium hover:text-gray-600',
                            $route.path === '/reservations' ? 'border-primary border-b-2' : ''
                        ]">
                            Mis Reservas
                        </router-link>
                    </div>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:items-center">
                    <button v-if="!user" @click="openLoginModal"
                        class="mr-3 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Iniciar Sesión
                    </button>
                    <div v-else class="relative">
                        <button @click="toggleUserMenu"
                            class="mr-3 inline-flex items-center px-3 py-1.5 border border-transparent  font-medium rounded-md text-white bg-primary hover:bg-primary-dark duration-300">
                            <span class="mr-2">{{ user.name }}</span>
                            <ChevronDown v-if="!isUserMenuOpen" />
                            <ChevronUp v-else />
                        </button>
                        <div v-if="isUserMenuOpen"
                            class="absolute right-0 mt-2 w-48 bg-primary hover:bg-primary-dark rounded-md shadow-lg py-1 z-50">
                            <ul class="py-2 px-3 text-base text-white dark:text-white"
                                aria-labelledby="dropdownDefaultButton">
                                <li>
                                    <a @click.prevent="handleLogout" href="#" class="user-menu-item-dropdown">
                                        Cerrar Sesión
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <LoginModal :isOpen="isLoginModalOpen" @close="closeLoginModal" @login="handleLogin" />
    <InfoModal :isOpen="isInfoModalOpen" :infoModal="infoModal" @close="closeInfoModal" />
</template>

<script setup>
import { inject, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/Auth/useAuthStore'
import LoginModal from '@/components/common/LoginModal.vue'
import InfoModal from '@/components/common/InfoModal.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const isUserMenuOpen = ref(false)
const router = useRouter()
const isLoginModalOpen = ref(false)
const isInfoModalOpen = ref(false)
const infoModal = ref({
    title: '',
    message: '',
    type: ''
})

// LoginModal
const openLoginModal = () => {
    isLoginModalOpen.value = true
}

const closeLoginModal = () => {
    isLoginModalOpen.value = false
}

const handleLogin = () => {
    closeLoginModal()
    router.push({ name: 'Dashboard' })
}

//UserMenu
const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value
}

const handleLogout = () => {
    authStore.logout()
    const success = authStore.status == 200 ? 'Success' : 'Error'
    infoModal.value = {
        title: authStore.message,
        message: 'Sesión cerrada correctamente',
        type: success
    }
    toggleUserMenu()
    openInfoModal()
    router.push({ name: 'space' })
}

//InfOModal
const openInfoModal = () => {
    isInfoModalOpen.value = true
}

const closeInfoModal = () => {
    isInfoModalOpen.value = false
}

const companyName = inject('companyName')

</script>
