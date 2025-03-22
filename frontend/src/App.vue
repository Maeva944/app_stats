<template>
  <div v-if="isLoading">Chargement...</div>
  <div v-else  id="app">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Header from "./pages/Header.vue";
import Footer from "./pages/Footer.vue";

export default {
  components: {
    Header,
    Footer,
  },
  setup() {
    const isLoading = ref(true);
    const router = useRouter();

    const inactivityTimeout = 60 * 60 * 1000; 
    let timeoutId;

    // Fonction pour réinitialiser le timer d'inactivité
    const resetInactivityTimer = () => {
      clearTimeout(timeoutId); // Supprimer l'ancien timeout
      timeoutId = setTimeout(() => {
        console.warn("⏳ Temps d'inactivité écoulé, déconnexion !");
        localStorage.removeItem("token");
        router.push("/connexion");
      }, inactivityTimeout);
    };

    onMounted(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("🚫 Aucun token trouvé, redirection vers /connexion");
        router.push("/connexion");
        isLoading.value = false;
        return;
      }

      try {
        // 🔹 Décoder le token (payload)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expTime = payload.exp * 1000; // Convertir l'expiration en millisecondes
        const currentTime = Date.now();

        // 🔹 Vérifier si le token a expiré (au bout de 10 secondes dans ce cas)
        if (currentTime >= expTime) {
          console.warn("⏳ Token expiré après 10 secondes, suppression et redirection !");
          localStorage.removeItem("token");
          router.push("/connexion");
          isLoading.value = false;
          return;
        }

      } catch (error) {
        console.error("❌ Erreur lors du décodage du token :", error);
        localStorage.removeItem("token");
        router.push("/connexion");
        isLoading.value = false;
        return;
      }

      // Réinitialiser le timer d'inactivité à chaque action utilisateur
      document.addEventListener("mousemove", resetInactivityTimer);
      document.addEventListener("keydown", resetInactivityTimer);

      // Initialiser le timer d'inactivité
      resetInactivityTimer();

      isLoading.value = false;
    });

    return { isLoading };
  },
};
</script>


<style scoped>
/* 🌍 Assurer que toute la page prend au moins la hauteur complète */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* ✅ S'assurer que #app prend toute la hauteur et pousse le footer en bas */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ✅ Permet au contenu de prendre l’espace disponible */
main {
  flex: 1; /* ✅ Pousse le footer vers le bas */
}

/* 📌 Footer bien positionné en bas, mais pas collé */
footer {
  background: #333333;
  color: white;
  text-align: center;
  padding: 15px 0;
  width: 100%;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.2);
}

</style>
  

