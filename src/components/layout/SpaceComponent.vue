<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <FilterBar :initial-filters="filters" @apply-filters="applyFilters" />

        <div v-if="isLoaded">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <MediaCard v-for="media in filteredMedia" :key="media.id" :media="media" />
            </div>

            <div v-if="filteredMedia.length === 0" class="text-center py-12">
                <search-icon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron espacios</h3>
                <p class="mt-1 text-sm text-gray-500">Prueba con otros filtros o fechas.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { SearchIcon } from 'lucide-vue-next';
import FilterBar from '@/components/common/FilterBar.vue';
import MediaCard from '@/components/common/MediaCard.vue';
import { useMediaStore } from '@/stores/Media/useMediaStore';

const mediaStore = useMediaStore();
const isLoaded = ref(false);
onMounted(async () => {
    await mediaStore.getMediaList()
    isLoaded.value = true
})
const { mediaList } = storeToRefs(mediaStore)

defineEmits(['view-details', 'book-media']);

// Filters
const filters = ref({
    location: '',
    type: '',
    date: ''
});
// Computed properties
const filteredMedia = computed(() => {
    const filtered = mediaList.value.filter(media => {
        const locationMatch = !filters.value.location || media.location === filters.value.location;
        const typeMatch = !filters.value.type || media.type === filters.value.type;
        return locationMatch && typeMatch;
    });
    return filtered;
});

// Methods
function applyFilters(newFilters) {
    filters.value = { ...newFilters };
    // In a real app, this would trigger an API call with the filters
}
</script>
