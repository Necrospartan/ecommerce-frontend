import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: MainView,
            redirect: '/',
            children: [
                {
                    path: '',
                    name: 'space',
                    component: () =>
                        import('@/components/layout/SpaceComponent.vue')
                },
                {
                    path: 'reservations',
                    name: 'reservations',
                    component: () =>
                        import('@/components/layout/ReservationsComponent.vue')
                },
                {
                    path: 'mediaDetail/:id',
                    name: 'mediaDetail',
                    component: () =>
                        import('@/components/layout/MediaDetailComponent.vue')
                }
            ]
        }
    ]
})

export default router
