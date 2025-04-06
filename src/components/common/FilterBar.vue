<template>
    <div class="bg-white shadow rounded-lg mb-6 p-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
                <label for="location" class="block text-sm font-medium text-gray-700">Ubicación</label>
                <select id="location" v-model="filters.location"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                    <option value="">Todas las ubicaciones</option>
                    <option value="CDMX">Ciudad de México</option>
                    <option value="GDL">Guadalajara</option>
                    <option value="MTY">Monterrey</option>
                </select>
            </div>
            <div>
                <label for="type" class="block text-sm font-medium text-gray-700">Tipo de Medio</label>
                <select id="type" v-model="filters.type"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                    <option value="">Todos los tipos</option>
                    <option value="billboard">Espectacular</option>
                    <option value="digital">Pantalla Digital</option>
                    <option value="transit">Transporte Público</option>
                </select>
            </div>
            <div>
                <label for="date" class="block text-sm font-medium text-gray-700">Fecha Disponible</label>
                <input type="date" id="date" v-model="filters.date"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md" />
            </div>
        </div>
        <div class="mt-4 flex justify-end">
            <button @click="$emit('apply-filters', filters)"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <filter-icon class="h-4 w-4 mr-2" />
                Filtrar
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { FilterIcon } from 'lucide-vue-next'

const props = defineProps({
    initialFilters: {
        type: Object,
        default: () => ({
            location: '',
            type: '',
            date: ''
        })
    }
})

const emit = defineEmits(['apply-filters'])

const filters = ref({ ...props.initialFilters })

// Actualizar filtros si cambian las props
watch(
    () => props.initialFilters,
    (newFilters) => {
        filters.value = { ...newFilters }
    },
    { deep: true }
)
</script>
