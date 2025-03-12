<template>
  <div class="search-container">
    <h2>Liste des Techniciens</h2>

    <!-- Barre de recherche -->
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Rechercher un technicien..." 
        @focus="showSuggestions = true"
        @blur="hideSuggestions"
        @input="updateSuggestions"
      />
    </div>

    <!-- Boîte de suggestions -->
    <div v-if="showSuggestions" class="suggestions-box">
      <ul v-if="filteredSuggestions.length">
        <li 
          v-for="tech in filteredSuggestions" 
          :key="tech.id" 
          @mousedown="goToTechnicien(tech.id)"
        >
          <img :src="tech.photo || 'default-avatar.png'" alt="Photo" class="tech-photo" />
          <span>{{ tech.nom }} {{ tech.prenom }} {{ tech.matricule }}</span>
        </li>
      </ul>
      <p v-else class="no-results">Aucun technicien trouvé</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      techniciens: [],
      searchQuery: "",
      showSuggestions: false
    };
  },
  async created() {
    try {
      const response = await fetch("http://localhost:3000/");
      if (!response.ok) {
        throw new Error("Erreur serveur : " + response.status);
      }
      this.techniciens = await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des techniciens :", error);
    }
  },
  computed: {
    filteredSuggestions() {
      if (!this.searchQuery) return [];
      return this.techniciens.filter((tech) =>
        `${tech.nom} ${tech.prenom} ${tech.matricule}`.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    updateSuggestions() {
      this.showSuggestions = this.searchQuery.length > 0;
    },
    hideSuggestions() {
      setTimeout(() => {
        this.showSuggestions = false;
      }, 200);
    },
    goToTechnicien(id) {
        this.$router.push(`/techniciendetail/${id}`);
        this.showSuggestions = false;
    }
  }
  };
</script>

<style scoped>
/* 🌍 Conteneur principal */
.search-container {
  position: relative;
  max-width: 500px;
  margin: auto;
  margin-top: 10%;
  padding-top: 80px; /* ✅ Ajusté pour éviter qu’il touche le header */
  text-align: center;
}

/* 🔍 Titre */
h2 {
  font-size: 24px;
  font-weight: bold;
  color: #E60F04; /* ✅ Rouge entreprise */
  margin-bottom: 20px;
}

/* 📝 Barre de recherche */
.search-bar {
  position: relative;
  width: 100%;
}

.search-bar input {
  width: 100%;
  padding: 12px;
  border: 2px solid #FFDC00; /* ✅ Bordure jaune plus sobre */
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  text-align: center;
  transition: all 0.2s ease-in-out;
  background: white;
  color: black;
  box-shadow: none; /* ✅ Suppression de l'ombre rouge */
}

/* Effet au focus */
.search-bar input:focus {
  border-color: #E60F04;
  box-shadow: 0px 2px 8px rgba(255, 0, 0, 0.3); /* ✅ Ombre plus douce */
}

/* 📜 Boîte de suggestions */
.suggestions-box {
  position: absolute;
  top: 100%;
  width: 105%;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  margin-top: 5px;
}

/* ✅ Liste des suggestions */
.suggestions-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions-box li {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s ease-in-out;
  color: black;
  border-bottom: 1px solid #ddd;
}

.suggestions-box li:hover {
  background: #FFDC00; /* ✅ Jaune au hover */
  color: #E60F04;
}

/* 🚫 Correction du message "Aucun technicien trouvé" */
.no-results {
  padding: 12px;
  text-align: center;
  color: #666; /* ✅ Gris foncé au lieu de rouge vif */
  font-style: italic;
  background: #f8f8f8; /* ✅ Fond légèrement gris */
  border-radius: 10px;
  width: fit-content;
  margin: 10px auto;
}

/* 📷 Image du technicien */
.tech-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  border: 2px solid #E60F04;
}

</style>