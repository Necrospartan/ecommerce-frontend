<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 sm:px-0 mb-6 flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-semibold text-gray-900">Administración de Espacios Publicitarios</h1>
                <p class="mt-1 text-sm text-gray-600">Gestiona los espacios disponibles en la plataforma</p>
            </div>
            <button @click="openCreateModal()"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <plus-icon class="h-4 w-4 mr-2" />
                Nuevo Espacio
            </button>
        </div>

        <FilterBar :initial-filters="filters" @apply-filters="applyFilters" />

        <!-- Tabla de medios -->
        <div v-if="isLoaded" class="table-auto-adjust bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Espacio
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ubicación
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio/Día
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha Creación
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="media in filteredMedia" :key="media.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10">
                                        <img class="h-10 w-10 rounded-md object-cover" :src="media.image"
                                            :alt="media.name">
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">{{ media.name }}</div>
                                        <div class="text-sm text-gray-500">ID: {{ media.id }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{{ getLocationName(media.location) }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                    :class="getTypeClass(media.type)">
                                    {{ getTypeLabel(media.type) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ formatCurrency(media.price_per_day) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ formatDate(media.created_at) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button @click="openEditModal(media)" class="text-primary hover:text-primary-dark">
                                        <edit-icon class="h-5 w-5" />
                                    </button>
                                    <button @click="openDeleteModal(media)" class="text-red-600 hover:text-red-900">
                                        <trash-icon class="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <!-- <tr v-if="filteredMedia.length === 0">
                            <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500">
                                No se encontraron espacios publicitarios
                            </td>
                        </tr> -->
                    </tbody>
                </table>
            </div>
        </div>

        <MediaFormModal v-if="showFormModal" :media="selectedMedia" :is-edit-mode="isEditMode" @close="closeFormModal"
            @save="saveMedia" />

        <DeleteConfirmationModal v-if="showDeleteModal" :media="selectedMedia" @close="closeDeleteModal"
            @confirm="deleteMedia" />
        <InfoModal :isOpen="isInfoModalOpen" :infoModal="infoModal" @close="closeInfoModal" />
    </div>
</template>

<script setup>
import {
    PlusIcon,
    EditIcon,
    TrashIcon,
} from 'lucide-vue-next'

import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import MediaFormModal from '@/components/common/MediaFormModal.vue'
import InfoModal from '@/components/common/InfoModal.vue'
import FilterBar from '@/components/common/FilterBar.vue'
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal.vue'
import { useMediaStore } from '@/stores/Media/useMediaStore'
import { useAuthStore } from '@/stores/Auth/useAuthStore'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const mediaStore = useMediaStore()
const showFormModal = ref(false)
const isLoaded = ref(false);

const showDeleteModal = ref(false)
const isEditMode = ref(false)
const selectedMedia = ref(null)
const router = useRouter()
const { mediaList } = storeToRefs(mediaStore)

const isInfoModalOpen = ref(false)
const infoModal = ref({
    title: '',
    message: '',
    type: ''
})

onMounted(async () => {
    if (user.value == null)
        await authStore.checkAuth()
    if (user.value == null || user.value.role != 'Admin')
        gohome()
    await mediaStore.getMediaList()
    isLoaded.value = true
})

// Filters
const filters = ref({
    location: '',
    type: '',
    date: ''
});
const filteredMedia = computed(() => {
    const filtered = mediaList.value.filter(media => {
        const locationMatch = !filters.value.location || media.location === filters.value.location;
        const typeMatch = !filters.value.type || media.type === filters.value.type;
        return locationMatch && typeMatch;
    });
    return filtered;
});

function openCreateModal() {
    selectedMedia.value = {
        name: '',
        location: 'CDMX',
        type: 'billboard',
        image: '',
        price_per_day: 0
    }
    isEditMode.value = false
    showFormModal.value = true
}

async function saveMedia(mediaData) {
    if (isEditMode.value) {
        await mediaStore.updateMedia(mediaData, selectedMedia.value.id)
        isEditMode.value = false
    }
    else {
        await mediaStore.addMedia(mediaData)
    }
    closeFormModal()

    const success = mediaStore.status <= 201 ? 'success' : 'error'
    infoModal.value = {
        title: mediaStore.message,
        message: mediaStore.message,
        type: success
    }
    openInfoModal()
}
function openEditModal(media) {
    selectedMedia.value = { ...media };
    isEditMode.value = true;
    showFormModal.value = true;
}

function openDeleteModal(media) {
    selectedMedia.value = media;
    showDeleteModal.value = true;
}

function closeDeleteModal() {
    showDeleteModal.value = false;
    selectedMedia.value = null;
}

function deleteMedia() {
    if (selectedMedia.value) {
        mediaStore.deleteMedia(selectedMedia.value.id)
    }

    closeDeleteModal();
}

const openInfoModal = () => {
    isInfoModalOpen.value = true
}

const closeInfoModal = () => {
    isInfoModalOpen.value = false
}

function closeFormModal() {
    showFormModal.value = false
}

function gohome() {
    router.push({ name: 'home' })
}

function applyFilters(newFilters) {
    filters.value = { ...newFilters };
}

function getTypeClass(type) {
    switch (type.toLowerCase()) {
        case 'billboard':
            return 'bg-blue-100 text-blue-800';
        case 'digital':
            return 'bg-green-100 text-green-800';
        case 'transit':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function getTypeLabel(type) {
    switch (type.toLowerCase()) {
        case 'billboard':
            return 'Espectacular';
        case 'digital':
            return 'Digital';
        case 'transit':
            return 'Transporte';
        default:
            return type;
    }
}

function getLocationName(locationCode) {
    const locations = {
        'CDMX': 'Ciudad de México',
        'GDL': 'Guadalajara',
        'MTY': 'Monterrey',
        'MOR': 'Morelia',
    };

    return locations[locationCode] || locationCode;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}
</script>

<style scoped>
.table-auto-adjust table {
    table-layout: auto;
    width: 100%;
}

.table-auto-adjust td:nth-child(1) {
    word-break: break-word;
    white-space: normal;
}
</style>
