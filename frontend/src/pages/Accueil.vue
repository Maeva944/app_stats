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
      this.$router.push(`/technicien/${id}`);
      this.showSuggestions = false;
    }
  }
};
</script>

<style>
/* Conteneur de recherche */
.search-container {
  position: relative;
  max-width: 400px;
  margin: auto;
}

/* Barre de recherche */
.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

/* Boîte de suggestions */
.suggestions-box {
  position: absolute;
  top: 100%;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

/* Liste des suggestions */
.suggestions-box ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.suggestions-box li {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.suggestions-box li:hover {
  background: #f0f0f0;
}

/* Message "Aucun technicien trouvé" */
.no-results {
  padding: 10px;
  text-align: center;
  color: #777;
  font-style: italic;
}

/* Image du technicien */
.tech-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>



  
  