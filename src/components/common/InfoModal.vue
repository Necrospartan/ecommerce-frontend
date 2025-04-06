<template>
    <!-- Info Modal -->
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
        aria-modal="true">
        <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <!-- Si se da click sobre la parte obscura del modal este se cierra -->
            <div @click="closeInfoModal" class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                aria-hidden="true">
            </div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
            </span>

            <div
                class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div :class="infoModal.type === 'success' ? 'bg-green-100' : 'bg-red-100'"
                            class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full sm:mx-0 sm:h-10 sm:w-10">
                            <InfoIcon :class="infoModal.type === 'success' ? 'text-green-600' : 'text-red-600'"
                                class="w-6 h-6" />
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h1 class="text-2xl font-medium leading-9 text-black" id="modal-title">
                                {{ infoModal.title }}
                            </h1>
                            <div class="mt-2">
                                <p class="text-lg text-gray-500">
                                    {{ infoModal.message }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" @click="closeInfoModal"
                        class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { InfoIcon } from 'lucide-vue-next'

const emit = defineEmits(['close', 'accept'])

defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    infoModal: {
        type: Object,
        required: true,
        default: () => ({
            title: 'Información',
            message: '',
            type: ''
        })
    }
})

const closeInfoModal = () => {
    emit('close')
}

</script>
