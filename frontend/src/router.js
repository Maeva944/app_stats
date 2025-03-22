import { createRouter, createWebHashHistory } from "vue-router";
import Accueil from "./pages/Accueil.vue";
import Connexion from "./pages/Connexion.vue";
import nouveaumdp from "./pages/ChangerMdp.vue";
import Inscription from "./pages/Inscription.vue";
import Importer from "./pages/Importer.vue";
import NotFound from "./pages/NotFound.vue";
import TechnicienDetails from "./pages/TechnicienDetails.vue";
import AjouterEmploye from './pages/AjouteEmploye.vue';

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
            component: nouveaumdp,
            meta: { requiresAuth: true }
        },
        {
            path: '/importer',
            component: Importer,
            meta: { requiresAuth: true }
        },
        {
            path: '/techniciendetail/:id',
            component: TechnicienDetails,
            meta: { requiresAuth: true }
        },
        {
            path:'/ajouteremploye',
            component: AjouterEmploye,
            meta : { requiresAuth : true }
        },
        {
            path: '/:pathMatch(.*)*', 
            name: 'NotFound', 
            component: NotFound
        }
    ]
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token"); 

    if (to.meta.requiresAuth) {
        if (!token) {
            console.warn("🚫 Aucun token trouvé, redirection vers /connexion");
            return next("/connexion");
        }

        // Vérifier si le token est expiré
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Décode le token JWT
        const expTime = decodedToken.exp * 1000; // Convertir en millisecondes
        const currentTime = Date.now();

        if (currentTime >= expTime) {
            console.warn("⏳ Token expiré, redirection vers /connexion");
            localStorage.removeItem("token"); // Supprime le token
            return next("/connexion");
        }
    }

    next(); 
});


export default router