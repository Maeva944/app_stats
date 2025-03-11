<template>
  <div v-if="isLoading">Chargement...</div>
  <div v-else>
    <Header />
    <router-view />
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
    Footer
  },
  setup() {
    const isLoading = ref(true);
    const router = useRouter();

    onMounted(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("🚫 Aucun token trouvé, redirection vers /connexion");
        router.push("/connexion");
      }
      isLoading.value = false;
    });

    return { isLoading };
  }
};
</script>

