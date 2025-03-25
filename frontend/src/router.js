import { createRouter, createWebHashHistory } from "vue-router";
import Accueil from "./pages/Accueil.vue";
import Connexion from "./pages/Connexion.vue";
import nouveaumdp from "./pages/ChangerMdp.vue";
import Inscription from "./pages/Inscription.vue";
import Importer from "./pages/Importer.vue";
import NotFound from "./pages/NotFound.vue";
import TechnicienDetails from "./pages/TechnicienDetails.vue";
import AjouterEmploye from './pages/AjouteEmploye.vue';
import Unauthorized from './pages/Unauthorized.vue';

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
            path:'/unauthorized',
            component: Unauthorized,
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
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            
            // Récupération des infos cruciales
            const userRole = decoded.role_id;
            const technicienId = decoded.technicien_id;

            // 🔴 Gestion des techniciens (role_id = 3)
            if (userRole === 3) {
                if (to.path === `/techniciendetail/${technicienId}`) {
                    return next(); 
                } else {
                    // Redirige vers sa fiche technique s'il tente d'accéder à autre chose
                    return next(`/techniciendetail/${technicienId}`);
                }
            }

            // 🔵 Gestion des admins (role_id = 1)
            if (userRole === 1) {
                if (['/', '/importer', '/ajouteremploye'].includes(to.path)) {
                    return next(); // Autorise l'accès aux pages admin
                }
            }

            // Si aucun cas ne correspond, accès refusé
            return next("/unauthorized");

        } catch (error) {
            console.error("Erreur de décodage du token :", error);
            localStorage.removeItem("token");
            return next("/connexion");
        }
    }
    next(); 
});


export default router