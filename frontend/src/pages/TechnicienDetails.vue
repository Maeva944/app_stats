<template>
  <p>ID du technicien : {{ $route.params.id }}</p>

  <div class="stat-container">
    <img :src="technicien?.photo || defaultPhoto" alt="Photo du technicien" class="photo-tech" />
    <div class="technicien-info">
      <h2>{{ technicien?.nom }} {{ technicien?.prenom }}</h2>
      <p>Technicien Vitrage Expert</p>
      <p><span class="nps-score">NPS :</span> <strong>{{ technicien?.nps || "N/A" }}</strong></p>
    </div>
  </div>

  <label for="mois">Mois :</label>
    <select v-model="moisChoisi" id="mois" @change="updateStats">
      <option v-for="mois in moisDisponibles" :key="mois.id" :value="mois.id" >
        {{ mois.nom }}
      </option>
    </select>
    
    <label for="annee">Année :</label>
    <input @change="updateStats" type="number" id="annee" v-model="anneeChoisie" min="2000" max="2100" />

    <button @click="toggleAnnee" class="toggle-annee">
      {{ aLAnnee ? "Voir par Mois" : "À l'année" }}
    </button>

  <!-- 🔹 Affichage des catégories si elles existent -->
  <div v-if="Object.keys(statistiques).length > 0" class="categories">
    <button
      v-for="(stat, key) in statistiques"
      :key="key"
      @click="categorieActive = key"
      :class="{ active: categorieActive === key }"
    >
      {{ key }}
    </button>
  </div>

  <!-- 🔹 Affichage des statistiques par catégorie -->
  <div v-if="statistiques[categorieActive]" class="stat-card-container">
    <div v-for="(stat, index) in statistiques[categorieActive].data" :key="index" class="stat-card">
      <p class="stat-title">{{ stat.sous_categorie }}</p>
      <p v-if="stat.valeur !== undefined" :class="{ 'stat-value': true, 'high': stat.valeur >= 80, 'low': stat.valeur < 50 }">
        {{ stat.valeur.toFixed(1) }}%
      </p>
      <p v-else class="stat-value">N/A</p>
    </div>
  </div>

  <p v-else>Aucune statistique disponible</p>
</template>

<script>
import { getData } from "../api";
export default {
  data() {
    return {
      moisDisponibles: [],
      moisChoisi: new Date().getMonth() + 1,
      anneeChoisie: new Date().getFullYear(),
      technicien: null,
      statistiques: {},
      categorieActive: "",
      defaultPhoto: "https://via.placeholder.com/100",
      aLAnnee: false, 
    };
  },
  async created(){
    await this.fetchMois();
    await this.fetchTechnicien();
    await this.fetchStatistiques();
  },
  
  methods: {
    async fetchTechnicien() {
    const id = this.$route.params.id; 
    try {
    const data = await getData(`/techniciendetail/${id}`);

    if (data.error) {
      alert(data.error);
      return;
    }

    this.technicien = data.technicien;
    
    console.log("✅ Technicien récupéré :", this.technicien);
  } catch (error) {
    console.error("❌ Erreur de récupération des infos du technicien :", error);
  }
  },
  async fetchMois() {
  try {
    this.moisDisponibles = await getData("/mois");
  } catch (error) {
    console.error("❌ Impossible de charger les mois :", error);
    this.errorMessage = "Impossible de charger les mois.";
  }
  },
  async fetchStatistiques() {
  const id = this.$route.params.id;
  if (!id) return;

  let endpoint = `/statistiques/${id}?annee=${this.anneeChoisie}&aLAnnee=${this.aLAnnee}`;
  
  if (!this.aLAnnee && this.moisChoisi) {
    endpoint += `&mois_id=${this.moisChoisi}`;
  }

  try {
    // 🔹 Récupération des statistiques
    this.statistiques = await getData(endpoint);
    
    // 🔹 Trier les sous-catégories dans chaque catégorie
    Object.keys(this.statistiques).forEach(categorie => {
      if (Array.isArray(this.statistiques[categorie].data)) { 
        this.statistiques[categorie].data.sort((a, b) => {
          const keyA = a.sous_categorie.toLowerCase();
          const keyB = b.sous_categorie.toLowerCase();
          const isGlobalA = keyA.includes("global");
          const isGlobalB = keyB.includes("global");

          if (isGlobalA && !isGlobalB) return 1; 
          if (!isGlobalA && isGlobalB) return -1; 
          return 0;
        });
      } else {
        console.warn(`⚠️ La catégorie "${categorie}" ne contient pas un tableau de données.`);
      }
    });

    console.log("📊 Données triées :", this.statistiques);
    this.categorieActive = Object.keys(this.statistiques)[0] || "";
  } catch (error) {
    console.error("❌ Erreur de récupération des statistiques :", error);
  }
},




    updateStats() {
      this.fetchStatistiques(); 
    },
    toggleAnnee() {
      this.aLAnnee = !this.aLAnnee;
      this.fetchStatistiques(); // 🔹 Recharge avec ou sans mois
    }  
  }
}
</script>

<style scoped>
.stat-container {
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: #1a1a2e;
  color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* 🔹 Informations du technicien */
.technicien-info {
  display: block;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid #444;
  width: 45%;
}

.technicien-info h2 {
  color: #fff;
  font-size: 25pt;
}

.photo-tech {
  width: 50%;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

/* 🔹 Score NPS */
.nps-score {
  color: orange;
}

/* 🔹 Catégories */
.categories {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.categories button {
  background: #3a3a5e;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.categories .active {
  background: orange;
}

/* 🔹 Cartes de statistiques */
.stat-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
  margin-top: 20px;
}

.stat-card {
  background: #252545;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.stat-title {
  font-size: 14px;
  color: #ddd;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
}

.high {
  color: limegreen;
}

.low {
  color: red;
}
</style>
