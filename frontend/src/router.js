import { createRouter, createWebHashHistory } from "vue-router";
import Accueil from "./pages/Accueil.vue";
import Connexion from "./pages/Connexion.vue";
import Inscription from "./pages/Inscription.vue";
import Deconnection from "./pages/Deconnection.vue";
import Technicien from "./pages/Technicien.vue";
import NotFound from "./pages/NotFound.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: Accueil
        },
        {
            path: '/connexion',
            component: Connexion
        },
        {
            path: '/inscription',
            component: Inscription
        },
        {
            path: '/deconnection',
            component: Deconnection
        },
        {
            path: '/technicien',
            component: Technicien
        },
        {
            path: '/:pathMatch(.*)*', 
            name: 'NotFound', 
            component: NotFound
        }
    ]
})

export default router