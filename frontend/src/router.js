import { createRouter, createWebHashHistory } from "vue-router";
import Accueil from "./pages/Accueil.vue";
import Connexion from "./pages/Connexion.vue";
import nouveaumdp from "./pages/ChangerMdp.vue";
import Inscription from "./pages/Inscription.vue";
import Deconnection from "./pages/Deconnection.vue";
import Importer from "./pages/Importer.vue";
import NotFound from "./pages/NotFound.vue";
import TechnicienDetails from "./pages/TechnicienDetails.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: Accueil,
            meta: { requiresAuth: true }
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
            path: '/nouveaumdp',
            component: nouveaumdp
        },
        {
            path: '/deconnection',
            component: Deconnection
        },
        {
            path: '/importer',
            component: Importer
        },
        {
            path: '/techniciendetail/:id',
            component: TechnicienDetails
        },
        {
            path: '/:pathMatch(.*)*', 
            name: 'NotFound', 
            component: NotFound
        }
    ]
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem("token"); 
    if (to.meta.requiresAuth && !isAuthenticated) {
      next("/connexion"); 
    } else {
      next(); 
    }
  });

export default router