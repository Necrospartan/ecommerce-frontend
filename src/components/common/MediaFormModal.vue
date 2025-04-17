<template>
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-white/30 backdrop-blur-xs" aria-hidden="true" @click="closeModal"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
            </span>

            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form @submit.prevent="handleSubmit">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    {{ isEditMode ? 'Editar Espacio Publicitario' : 'Crear Nuevo Espacio Publicitario'
                                    }}
                                </h3>
                                <div class="mt-4 space-y-4">
                                    <div>
                                        <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
                                        <input type="text" id="name" v-model="formData.name"
                                            class="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            required>
                                        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                                    </div>

                                    <div>
                                        <label for="location"
                                            class="block text-sm font-medium text-gray-700">Ubicación</label>

                                        <select id="location" v-model="formData.location"
                                            class="bg-gray-200 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                            required>
                                            <option v-for="location in locations" :key="location.code"
                                                :value="location.code">
                                                {{ location.name }}
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label for="type" class="block text-sm font-medium text-gray-700">Tipo</label>
                                        <select id="type" v-model="formData.type"
                                            class="bg-gray-200 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                            required>
                                            <option value="billboard">Espectacular</option>
                                            <option value="digital">Digital</option>
                                            <option value="transit">Transporte</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label for="price" class="block text-sm font-medium text-gray-700">Precio por
                                            día (MXN)</label>
                                        <div class="mt-1 relative rounded-md shadow-sm">
                                            <div
                                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span class="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input type="number" id="price" v-model="formData.price_per_day"
                                                class="bg-gray-200 focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                                placeholder="0.00" min="0" step="0.01" required>
                                            <div
                                                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span class="text-gray-500 sm:text-sm">MXN</span>
                                            </div>
                                        </div>
                                        <p v-if="errors.price_per_day" class="mt-1 text-sm text-red-600">{{
                                            errors.price_per_day }}</p>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Imagen</label>

                                        <div v-if="!imagePreviewUrl"
                                            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                                            @dragover.prevent @drop.prevent="handleDrop">
                                            <div class="space-y-1 text-center">
                                                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor"
                                                    fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H20V16H8V40H40V16H28V8Z" stroke-width="2"
                                                        stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                <div class="flex text-sm text-gray-600 justify-center">
                                                    <label for="file-upload"
                                                        class="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                                                        <span>Selecciona un archivo</span>
                                                        <input id="file-upload" name="file-upload" type="file"
                                                            class="sr-only" @change="handleFileChange" />
                                                    </label>
                                                    <p class="pl-1">o arrástralo aquí</p>
                                                </div>
                                                <p class="text-xs text-gray-500">JPG, PNG, hasta 5MB</p>
                                            </div>
                                        </div>

                                        <div v-if="imagePreviewUrl" class="mt-4">
                                            <img :src="imagePreviewUrl" alt="Vista previa"
                                                class="max-h-48 mx-auto rounded-md shadow" />
                                            <button type="button" @click="removeImage"
                                                class="mt-2 text-sm text-red-600 hover:underline">
                                                Quitar imagen
                                            </button>
                                        </div>

                                        <p v-if="errors.image" class="mt-1 text-sm text-red-600">{{ errors.image }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="submit"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                            :disabled="isLoading">
                            {{ isEditMode ? 'Guardar cambios' : 'Crear espacio' }}
                            <span v-if="isLoading">
                                <Spinner />
                            </span>
                        </button>
                        <button type="button"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            @click="closeModal">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Spinner from '@/components/common/Spinner.vue'

const props = defineProps({
    media: {
        type: Object,
        required: true
    },
    isEditMode: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close', 'save'])

const isLoading = ref(false)

const locations = [
    { code: 'CDMX', name: 'Ciudad de México' },
    { code: 'GDL', name: 'Guadalajara' },
    { code: 'MTY', name: 'Monterrey' },
    { code: 'MOR', name: 'Morelia' },
]

const formData = ref({
    name: '',
    location: 'CDMX',
    type: 'billboard',
    image: null, // Inicializar como null para almacenar el objeto File
    price_per_day: 0
})

const errors = ref({})
const imagePreviewUrl = ref(null)

onMounted(() => {
    if (props.media) {
        formData.value.name = props.media.name || ''
        formData.value.location = props.media.location || 'CDMX'
        formData.value.type = props.media.type || 'billboard'
        formData.value.image = props.media.image || null
        formData.value.price_per_day = props.media.price_per_day || 0
        if (props.media.image) {
            imagePreviewUrl.value = props.media.image
        }
    }
})

function validateForm() {
    errors.value = {};
    let isValid = true;

    if (formData.value.name && !formData.value.name.trim()) {
        errors.value.name = 'El nombre es obligatorio';
        isValid = false;
    }

    if (formData.value.image) {
        if (!(formData.value.image instanceof File)) {
            errors.value.image = 'El formato de la imagen no es válido';
            isValid = false;
        }
    } else if (!props.isEditMode) {
        errors.value.image = 'La imagen es obligatoria';
        isValid = false;
    }

    if (formData.value.price_per_day !== null && formData.value.price_per_day !== undefined) {
        if (formData.value.price_per_day <= 0) {
            errors.value.price_per_day = 'El precio debe ser mayor que cero';
            isValid = false;
        }
    }

    return isValid;
}

function handleSubmit() {
    if (props.isEditMode) {
        getDifferences()
    }
    if (validateForm()) {
        isLoading.value = true
        emit('save', { ...formData.value })
    }
}

function getDifferences() {
    const differences = {}
    for (const key in formData.value) {
        if (formData.value[key] !== props.media[key]) {
            differences[key] = formData.value[key]
        }
    }
    formData.value = differences
}

function closeModal() {
    emit('close')
}

function handleFileChange(event) {
    const file = event.target.files[0]
    readFile(file)
    if (file && !errors.value.image) {
        formData.value.image = file
        createImagePreview(file)
    }
}

function handleDrop(event) {
    const file = event.dataTransfer.files[0]
    readFile(file)
    if (file && !errors.value.image) {
        formData.value.image = file
        createImagePreview(file)
    }
}

function readFile(file) {
    if (!file) {
        errors.value.image = 'Por favor, selecciona una imagen.'
        return
    }

    if (!file.type.startsWith('image/')) {
        errors.value.image = 'El archivo debe ser una imagen.'
        return
    }
    if (file.size > 5 * 1024 * 1024) {
        errors.value.image = 'La imagen no debe superar los 5MB.'
        return
    }

    errors.value.image = null
}

function createImagePreview(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
        imagePreviewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
}

function removeImage() {
    formData.value.image = null
    imagePreviewUrl.value = null
}
</script>
