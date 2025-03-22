<template>
  <p>ID du technicien : {{ $route.params.id }}</p>

  <div class="stat-container">
    <img :src="technicien?.photo" alt="Photo du technicien" class="photo-tech" />
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
  <div class="categories">
  <button
    v-for="categorie in categories"
    @change="updateStats"
    :key="categorie.id"
    @click="categorieActive = categorie.id"
    :class="{ active: categorieActive === categorie.id }"
  >
    {{ categorie.nom }}
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
  <div v-if="categorieActive === 1" class="commentaires-container">
    <h3>Avis clients</h3>
    <ul v-if="Array.isArray(commentaires) && commentaires.length > 0">
      <li v-for="(commentaire, index) in commentaires" :key="index" class="commentaire-item">
        <strong>Produit :</strong> {{ commentaire.produit }} <br>
        <strong>Avis :</strong> {{ commentaire.avis }} <br>
        <strong>Suggestion :</strong> {{ commentaire.suggestion }} <br>
        <strong>Score NPS :</strong> {{ commentaire.nps_score }} <br>
        <strong>Date :</strong> {{ formatDate(commentaire.job_date) }}
      </li>
    </ul>
    <p v-else>Aucun avis disponible</p>
</div>



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
      categories: [],
      defaultPhoto: "path/to/defaultpdp.png",
      aLAnnee: false,
      commentaires: [], 
    };
  },
  async created(){
    await this.fetchMois();
    await this.fetchTechnicien();
    await this.fetchStatistiques();
    await this.fetchCommentaires();
    await this.fetchCategories();
  },
  
  methods: {
    async fetchCategories() {
  try {
    this.categories = await getData("/categories"); // 🔥 Appelle la nouvelle route API
    console.log("📌 Catégories récupérées :", this.categories);
  } catch (error) {
    console.error("❌ Erreur de récupération des catégories :", error);
  }
  },
    async fetchCommentaires() {
    this.commentaires= [];
    const id = this.$route.params.id;
    if (!id) return;

  let endpoint = `/commentaires/${id}?annee=${this.anneeChoisie}`;
  
  if (!this.aLAnnee && this.moisChoisi) {
    endpoint += `&mois_id=${this.moisChoisi}`;
  }

  console.log(`🔎 Requête envoyée : ${endpoint}`)
  console.log("📊 Statistiques mises à jour :", this.statistiques);

  try {
    this.commentaires = await getData(endpoint);
    console.log("💬 Commentaires récupérés :", this.commentaires);
  } catch (error) {
    console.error("❌ Erreur de récupération des commentaires :", error);
  }
},
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

    let endpoint = `/statistiques/${id}?annee=${this.anneeChoisie}&categorie_id=${this.categorieActive}`;

    if (!this.aLAnnee && this.moisChoisi) {
        endpoint += `&mois_id=${this.moisChoisi}`;
    }

    // 🔥 Ajout du paramètre "aLAnnee"
    endpoint += `&aLAnnee=${this.aLAnnee}`;

    console.log(`📡 Requête envoyée à l'API : ${endpoint}`);

    try {
        const statsData = await getData(endpoint);
        console.log("📊 Données reçues de l'API :", statsData);

        // Vérifier que les stats sont bien un objet
        if (!statsData || typeof statsData !== "object") {
            console.error("❌ Données statistiques incorrectes :", statsData);
            return;
        }

        let statistiquesTransformees = {};

        // 🔹 Initialiser chaque catégorie, même si elle n'a pas encore de données
        this.categories.forEach((categorie) => {
            statistiquesTransformees[categorie.id] = {
                mois: null,
                annee: this.anneeChoisie,
                data: []
            };
        });

        // 🔹 Remplir les catégories avec leurs statistiques existantes
        Object.keys(statsData).forEach((categorie) => {
            const { mois, annee, data } = statsData[categorie];

            statistiquesTransformees[categorie] = {
                mois: mois || null,
                annee: annee,
                data: Array.isArray(data) ? data : []
            };
        });

        Object.keys(statistiquesTransformees).forEach((categorie) => {
      statistiquesTransformees[categorie].data.sort((a, b) => {
        if (a.sous_categorie.toLowerCase() === "global") return 1;
        if (b.sous_categorie.toLowerCase() === "global") return -1;
        return 0;
      });
    });

        this.statistiques = statistiquesTransformees;
        console.log("📊 Données finales à afficher :", this.statistiques);
        this.categorieActive = Object.keys(this.statistiques)[0] || "";

    } catch (error) {
        console.error("❌ Erreur de récupération des statistiques :", error);
    }
},
toggleAnnee() {
  console.log("🔄 Changement d'affichage (Année/Mois)");
  this.aLAnnee = !this.aLAnnee;
  this.fetchStatistiques();
  this.fetchCommentaires();
},
updateStats(){
  this.fetchCommentaires();
  this.fetchStatistiques();
},
formatDate(dateString) {
    if (!dateString) return "Date inconnue";

    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
  }
  },
  watch: {
    moisChoisi(newMois, oldMois) {
        console.log(`📅 Changement de mois : ${oldMois} → ${newMois}`);
        if (this.categorieActive === "NPS") {
            this.fetchCommentaires();
        }
    },
    anneeChoisie(newAnnee, oldAnnee) {
        console.log(`📅 Changement d'année : ${oldAnnee} → ${newAnnee}`);
        if (this.categorieActive === "NPS") {
            this.fetchCommentaires();
        }
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

/* 📝 Conteneur principal des commentaires */
.commentaires-container {
  width: 90%;
  max-width: 900px;
  margin: 40px auto;
  padding: 5% 3%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border: 2px solid #E60F04;
}

/* 🏷️ Titre des commentaires */
.commentaires-container h3 {
  font-size: 40px;
  color: #E60F04;
  font-weight: bold;
  text-align: left;
  margin-bottom: 15px;
  border-bottom: 2px solid #E60F04;
  padding-bottom: 5px;
}

/* 📌 Liste des commentaires */
.commentaires-container ul {
  padding: 5%;
  margin: 0;
}


/* 🗨️ Carte de commentaire */
.commentaire-item {
  list-style: none;
  background: #f8f8f8;
  padding: 15px;
  border-radius: 8px;
  margin: 2% 1%;
  border-left: 5px solid #E60F04;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

/* 📝 Détails du commentaire */
.commentaire-item strong {
  color: #333;
  font-weight: bold;
}

.commentaire-item p {
  margin: 5px 0;
  color: #444;
  font-size: 16px;
}

/* ⭐ Score NPS */
.commentaire-item strong:contains("Score NPS") {
  color: #FFDC00;
}

/* 📅 Date */
.commentaire-item strong:contains("Date") {
  color: #777;
  font-style: italic;
}

</style>
