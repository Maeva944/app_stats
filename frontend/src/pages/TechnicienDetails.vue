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
    <div v-for="(stat, index) in statistiques[categorieActive]" :key="index" class="stat-card">
      <p class="stat-title">{{ stat.sous_categorie }}</p>
      <p :class="{ 'stat-value': true, 'high': stat.valeur >= 80, 'low': stat.valeur < 50 }">
        {{ stat.valeur.toFixed(1) }}%
      </p>
    </div>
  </div>

  <p v-else>Aucune statistique disponible</p>
</template>

<script>
export default {
  data() {
    return {
      technicien: null,
      statistiques: {},
      categorieActive: "",
      defaultPhoto: "https://via.placeholder.com/100",
    };
  },

  async created() {
    const id = this.$route.params.id; // ✅ Récupération correcte de l'ID
    try {
      const response = await fetch(`http://localhost:3000/techniciendetail/${id}`); // ✅ Vérifie l'URL
      if (!response.ok) {
        throw new Error("Erreur serveur : " + response.status);
      }
      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        this.technicien = data.technicien;
        
        // ✅ Transformation des statistiques pour correspondre au format attendu
        this.statistiques = this.transformerStatistiques(data.statistiques);
        
        // ✅ Définir la première catégorie comme active par défaut
        this.categorieActive = Object.keys(this.statistiques)[0] || "";
      }
    } catch (error) {
      console.error("❌ Erreur de récupération des statistiques :", error);
    }
  },

  methods: {
    transformerStatistiques(statistiquesArray) {
      let statistiquesTransformees = {};

      statistiquesArray.forEach(stat => {
        if (!statistiquesTransformees[stat.categorie]) {
          statistiquesTransformees[stat.categorie] = [];
        }

        // ✅ Parcourir les données JSON (donnee)
        Object.entries(stat.donnee).forEach(([sousCategorie, valeur]) => {
          statistiquesTransformees[stat.categorie].push({
            sous_categorie: sousCategorie.trim(),
            valeur: parseFloat(valeur) * 100 // Conversion en pourcentage
          });
        });
      });

      console.log("📊 Données transformées :", statistiquesTransformees);
      return statistiquesTransformees;
    }
  }
};
</script>

<style>
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
