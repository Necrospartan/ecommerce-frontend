<template>
    <div
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
    >
        <div
            class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
            <!-- Background overlay -->
            <div
                class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
                @click="$emit('close')"
            ></div>

            <!-- Modal panel -->
            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div
                            class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full"
                        >
                            <h3
                                class="text-lg leading-6 font-medium text-gray-900"
                                id="modal-title"
                            >
                                Iniciar sesión
                            </h3>
                            <div class="mt-4">
                                <form
                                    @submit.prevent="handleLogin"
                                    class="space-y-6"
                                >
                                    <div>
                                        <label
                                            for="email"
                                            class="block text-sm font-medium text-gray-700"
                                        >
                                            Correo electrónico
                                        </label>
                                        <div class="mt-1">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autocomplete="email"
                                                required
                                                v-model="form.email"
                                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            />
                                        </div>
                                        <p
                                            v-if="errors.email"
                                            class="mt-2 text-sm text-red-600"
                                        >
                                            {{ errors.email }}
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            for="password"
                                            class="block text-sm font-medium text-gray-700"
                                        >
                                            Contraseña
                                        </label>
                                        <div class="mt-1">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autocomplete="current-password"
                                                required
                                                v-model="form.password"
                                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            />
                                        </div>
                                        <p
                                            v-if="errors.password"
                                            class="mt-2 text-sm text-red-600"
                                        >
                                            {{ errors.password }}
                                        </p>
                                    </div>

                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <div class="flex items-center">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                v-model="form.rememberMe"
                                                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                            />
                                            <label
                                                for="remember-me"
                                                class="ml-2 block text-sm text-gray-900"
                                            >
                                                Recordarme
                                            </label>
                                        </div>

                                        <div class="text-sm">
                                            <a
                                                href="#"
                                                class="font-medium text-primary hover:text-primary-dark"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </a>
                                        </div>
                                    </div>

                                    <div
                                        v-if="errors.general"
                                        class="rounded-md bg-red-50 p-4"
                                    >
                                        <div class="flex">
                                            <div class="flex-shrink-0">
                                                <alert-circle-icon
                                                    class="h-5 w-5 text-red-400"
                                                />
                                            </div>
                                            <div class="ml-3">
                                                <h3
                                                    class="text-sm font-medium text-red-800"
                                                >
                                                    {{ errors.general }}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        >
                                            Iniciar sesión
                                        </button>
                                    </div>
                                </form>
                                <div class="mt-6">
                                    <div class="relative">
                                        <div
                                            class="absolute inset-0 flex items-center"
                                        >
                                            <div
                                                class="w-full border-t border-gray-300"
                                            ></div>
                                        </div>
                                        <div
                                            class="relative flex justify-center text-sm"
                                        >
                                            <span
                                                class="px-2 bg-white text-gray-500"
                                            >
                                                ¿No tienes una cuenta?
                                            </span>
                                        </div>
                                    </div>
                                    <div class="mt-6">
                                        <button
                                            @click="$emit('show-register')"
                                            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        >
                                            Registrarse
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                >
                    <button
                        type="button"
                        @click="$emit('close')"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { AlertCircleIcon } from 'lucide-vue-next'

const emit = defineEmits(['close', 'login', 'show-register'])

const form = ref({
    email: '',
    password: '',
    rememberMe: false
})

const errors = ref({})

function handleLogin() {
    // Resetear errores
    errors.value = {}

    // Validación básica
    if (!form.value.email) {
        errors.value.email = 'El correo electrónico es requerido'
    } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
        errors.value.email = 'Ingrese un correo electrónico válido'
    }

    if (!form.value.password) {
        errors.value.password = 'La contraseña es requerida'
    } else if (form.value.password.length < 6) {
        errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    // Si no hay errores, proceder con el login
    if (Object.keys(errors.value).length === 0) {
        emit('login', form.value)
    }
}
</script>
