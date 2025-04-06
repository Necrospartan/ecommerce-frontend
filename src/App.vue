<template>
    <router-view />
</template>

<script setup>
import { provide, onMounted } from 'vue'
import { useAuthStore } from '@/stores/Auth/useAuthStore'

const companyName = "AdSpaceBook"
const companyAbbreviation = "AdSB"

provide('companyName', companyName)
provide('companyAbbreviation', companyAbbreviation)

const authStore = useAuthStore()
onMounted(async () => {
    await authStore.checkAuth()
})

</script>

<style>
:root {
    --color-primary: #10b981;
    --color-primary-dark: #059669;
}

.bg-primary {
    background-color: var(--color-primary);
}

.bg-primary-dark {
    background-color: var(--color-primary-dark);
}

.text-primary {
    color: var(--color-primary);
}

.border-primary {
    border-color: var(--color-primary);
}

.focus\:ring-primary:focus {
    --tw-ring-color: var(--color-primary);
}

.focus\:border-primary:focus {
    border-color: var(--color-primary);
}

.hover\:bg-primary-dark:hover {
    background-color: var(--color-primary-dark);
}
</style>
