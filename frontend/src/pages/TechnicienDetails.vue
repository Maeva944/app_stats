<template>
  <p>ID du technicien : {{ $route.params.id }}</p>

  <div class="stat-container">
    <img :src="technicien?.photo || defaultPhoto" alt="Photo du technicien" class="photo-tech" />
    <div class="technicien-info">
      <h2>{{ technicien?.nom }} {{ technicien?.prenom }}</h2>
      <p>{{ technicien?.metier }}</p>
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
/* 🌍 Conteneur principal */
.stat-container {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* ✅ Aligne la photo à gauche */
  width: 90%;
  max-width: 900px;
  margin: auto;
  margin: 5% auto;
  padding: 20px 20px 20px; /* ✅ Décale sous le header */
  background: #F8F8F8;
  color: black;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* 📷 Photo du technicien */
.photo-tech {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #E60F04;
  margin-right: 20px; /* ✅ Espacement entre la photo et le texte */
}

/* 🏷️ Informations du technicien */
.technicien-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* ✅ Aligne le texte à gauche */
  text-align: left; /* ✅ Évite le centrage inutile */
}

.technicien-info h2 {
  color: #E60F04;
  font-size: 26px;
  margin: 5px 0;
  font-weight: bold;
}

/* 📊 Score NPS */
.nps-score {
  color: #FFDC00;
  font-weight: bold;
}

/* 📆 Sélecteurs Mois / Année */
label {
  font-weight: bold;
  margin: 0 0 0 3%;
}

select, input {
  padding: 8px;
  border: 2px solid #E60F04;
  border-radius: 5px;
  outline: none;
  font-size: 16px;
}

/* 🔘 Boutons */
button {
  background: #E60F04;
  color: white;
  font-weight: bold;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease;
  font-size: 16px;
}

button:hover {
  background: #C00D00;
}

button.toggle-annee {
  margin-left: 10px;
}

/* 📂 Catégories */
.categories {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.categories button {
  background: #3a3a5e;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  margin: 5px;
  font-size: 16px;
  margin-bottom: 3%;
}

.categories button.active {
  background: #FFDC00;
  color: black;
}

/* 📊 Cartes des statistiques */
.stat-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* ✅ Cartes plus grandes */
  gap: 15px;
  margin-top: 20px;
  text-align: center;
  width: 90%;
  max-width: 1100px;
  margin: auto;
}

.stat-card {
  background: #fff; 
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #E60F04;
  color: white;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
}

.stat-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

/* 📊 Valeurs */
.stat-value {
  font-size: 22px;
  font-weight: bold;
}

.high {
  color: #00FF00;
}

.low {
  color: #FF0000;
}

/* 📌 Texte "Aucune statistique disponible" */
p {
  text-align: center;
  font-size: 18px;
  font-style: italic;
  color: #666;
}

</style>
