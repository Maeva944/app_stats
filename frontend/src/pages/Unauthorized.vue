<template>
    <div class="unauthorized">
      <h1>Accès refusé ❌</h1>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <button @click="goToHome">Retour à l'accueil</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goToHome() {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          if (decoded.role_id === 3) {
            this.$router.push(`/techniciendetail/${decoded.technicien_id}`);
          } else {
            this.$router.push("/");
          }
        } else {
          this.$router.push("/connexion");
        }
      }
    }
  }
  </script>