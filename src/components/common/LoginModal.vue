<template>
    <!-- Login Modal -->
    <div v-if="isOpen" class="fixed inset-0 bg-gray/40 flex items-center justify-center z-50">
        <div class="bg-gray-100 rounded-lg p-8 max-w-md w-full">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-semibold text-gray-800">Iniciar Sesión</h2>
                <button @click="closeLoginModal" class="text-gray-600 hover:text-gray-800">
                    <XIcon class="h-6 w-6" />
                </button>
            </div>
            <div v-if="generalError"
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span class="block sm:inline">{{ generalErrorMessage }}</span>
            </div>
            <form @submit.prevent="handleLogin">
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                    <input type="email" id="email" v-model="email" required
                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800">
                </div>
                <div v-if="formErrors.email"
                    class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-800 rounded-lg bg-red-50  dark:text-red-400 dark:border-red-800"
                    role="alert">
                    <span class="sr-only">Danger</span>
                    <ul class="mt-1.5 list-disc list-inside">
                        <li v-for="(error, index) in formErrors.email" :key="index" class="text-red-500 text-sm">{{
                            error }}</li>
                    </ul>
                </div>
                <div class="mb-6 form-group">
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                    </label>
                    <div class="relative">
                        <input :type="passwordVisible ? 'text' : 'password'" id="password" v-model="password" required
                            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800">
                        <button type="button" @click="togglePasswordVisibility"
                            class="absolute inset-y-0 right-0 px-3 flex items-center focus:outline-none">
                            <EyeIcon v-if="!passwordVisible" class="h-5 w-5 text-gray-500" />
                            <EyeOffIcon v-else class="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                </div>
                <div v-if="formErrors.password"
                    class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-800 rounded-lg bg-red-50  dark:text-red-400 dark:border-red-800"
                    role="alert">
                    <span class="sr-only">Danger</span>
                    <ul class="mt-1.5 list-disc list-inside">
                        <li v-for="(error, index) in formErrors.password" :key="index" class="text-red-500 text-sm">{{
                            error }}</li>
                    </ul>
                </div>
                <button type="submit"
                    class="mb-2 w-full text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
                    :disabled="isLoading">
                    <span v-if="isLoading">
                        <Spinner />
                    </span>
                    <span v-else>Iniciar Sesión</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { XIcon, EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/Auth/useAuthStore'
import Spinner from '@/components/common/Spinner.vue'

defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['close', 'login'])

const email = ref('')
const password = ref('')
const formErrors = ref(
    {
        email: '',
        password: ''
    }
)
const generalError = ref(false)
const generalErrorMessage = ref('')
const passwordVisible = ref(false)

const isLoading = ref(false)

const closeLoginModal = () => {
    isLoading.value = false
    clearFormErrors()
    clearGeneralError()
    passwordVisible.value = false
    email.value = ''
    password.value = ''
    emit('close')
}

const clearFormErrors = () => {
    formErrors.value = {
        email: '',
        password: ''
    }
}
const clearGeneralError = () => {
    generalError.value = false
    generalErrorMessage.value = ''
}

const handleLogin = async () => {
    isLoading.value = true
    passwordVisible.value = false
    clearFormErrors()
    clearGeneralError()

    const authStore = useAuthStore()
    const { status, error, message } = storeToRefs(authStore)

    const credentials = {
        email: email.value,
        password: password.value
    }

    await authStore.login(credentials)

    isLoading.value = false

    if (status.value == 200) {
        emit('login')
        email.value = ''
        password.value = ''
        return
    }
    if (status.value == 422) {
        if (error.value.email) {
            formErrors.value.email = error.value.email
        }
        if (error.value.usuario) {
            formErrors.value.email = error.value.usuario
        }
        if (error.value.password) {
            formErrors.value.password = error.value.password
        }
        return
    }
    if (status.value != null) {
        generalError.value = true
        generalErrorMessage.value = message.value || 'Error desconocido al iniciar sesión.'
        return
    }
    if (error.value) {
        generalError.value = true
        generalErrorMessage.value = 'Error al conectar con el servidor.'
    }
}

const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
}
</script>
