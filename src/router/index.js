import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: MainView,
            children: [
                {
                    path: '',
                    name: 'space',
                    component: () =>
                        import('@/components/layout/SpaceComponent.vue')
                },
                {
                    path: 'reservations',
                    name: 'reservas',
                    component: () =>
                        import('@/components/layout/ReservationsComponent.vue')
                }
            ]
        }
    ]
})

export default router
