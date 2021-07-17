import { createRouter, createWebHistory } from "vue-router";
import CoachesList from '@/pages/coaches/CoachesList'
import CoachDetail from '@/pages/coaches/CoachDetail'
import CoachRegistration from '@/pages/coaches/CoachRegistration'
import ContactCoach from '@/pages/requests/ContactCoach'
import RequestsReceived from '@/pages/requests/RequestsReceived'
import NotFound from '@/pages/NotFound'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/coaches', component: CoachesList, alias: '/' },
        {
            path: '/coaches/:id', component: CoachDetail, props: true, children: [
                { path: 'contact', component: ContactCoach }
            ]
        },
        { path: '/register', component: CoachRegistration },
        { path: '/requests', component: RequestsReceived },
        { path: '/notFound(.*)', component: NotFound }
    ]
})

export default router;