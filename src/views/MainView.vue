<template>
    <div class="min-h-screen bg-gray-200">
        <NavBar />
        <router-view />
    </div>
</template>

<script setup>
import NavBar from '@/components/layout/NavbarComponent.vue'

</script>
