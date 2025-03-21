<template>
  <header class="header">
    <div class="logo">
      <h1>
        <router-link to="/" v-if="isLoggedIn" class="nav-item">VDE Tech</router-link>
      </h1>
    </div>
    <nav class="nav-links">
      <router-link to="/" v-if="isLoggedIn" class="nav-item">Accueil</router-link>
      <router-link to="/importer" v-if="isLoggedIn" class="nav-item">Importer des Statistiques</router-link>
      <router-link to="/ajouteremploye" v-if="isLoggedIn" class="nav-item">Ajouter des employés</router-link>
      <button v-if="isLoggedIn" @click="logout" class="logout-button">Déconnexion</button>
    </nav>
  </header>
</template>
  
<script>
  export default {
    data() {
    return {
      isLoggedIn: !!localStorage.getItem("token") // ✅ Vérifie si un token est stocké
    };
    },
    methods: {
      logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        this.$router.push("/connexion"); 
      }
    },
    watch: {
    '$route'() {
      this.isLoggedIn = !!localStorage.getItem("token");
    }
    }
  };
</script>
  
<style scoped>
/* 📌 Conteneur du header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #E60F04;  /* 🔥 Rouge principal */
  color: white;
  padding: 15px 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  position: fixed;  
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

body {
  padding-top: 70px; /* Ajuste en fonction de la hauteur du header */
}

/* 🏷️ Logo */
.logo h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

/* 🔗 Navigation */
.nav-links {
  display: flex;
  align-items: center;
  font-size: 15pt;
}

/* 🏠 Lien Accueil */
.nav-item {
  text-decoration: none;
  color: white;
  font-weight: bold;
  margin-right: 20px;
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: #FFDC00;  /* 🌟 Passe en jaune au survol */
}

/* 🔘 Bouton Déconnexion */
.logout-button {
  background: #FFDC00;
  color: #E60F04;
  font-weight: bold;
  border: none;
  padding: 10px 15px;
  margin-right: 30px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease;
}

.logout-button:hover {
  background: white;
  color: #E60F04;
}
</style>
  