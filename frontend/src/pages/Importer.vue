<template>
  <div class="import-container">
    <h2>Importer des Statistiques</h2>

    <label for="categorie">Veuillez choisir une catégorie :</label>
    <select v-model="categorieChoisie" id="categorie">
        <option value="Qualité Techniques">Qualité Techniques</option>
        <option value="NPS">NPS</option>
        <option value="VAPS">VAPS</option>
        <option value="Proposition">Proposition</option>
        <option value="Prime">Prime</option>
    </select>

    <label for="mois">Mois :</label>
    <select v-model="moisChoisi" id="mois">
      <option v-for="mois in moisDisponibles" :key="mois.id" :value="mois.id">
        {{ mois.nom }}
      </option>
    </select>

    
    <label for="annee">Année :</label>
    <input type="number" id="annee" v-model="anneeChoisie" min="2000" max="2100" />

    <!-- 🟢 Importation du fichier Excel -->
    <input  type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
    <button @click="uploadFile">Importer</button>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>

    <div v-if="missingMatricules.length > 0">
      <p class="error">Certains techniciens n'existent pas :</p>
      <ul>
        <li v-for="matricule in missingMatricules" :key="matricule">{{ matricule }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getData } from "../api";
import { postFormData } from "../api";
export default {
  data() {
    return {
      moisDisponibles: [],
      moisChoisi: "",
      anneeChoisie: new Date().getFullYear(),
      selectedFile: null,
      errorMessage: "", 
      successMessage: "", 
      missingMatricules: [],
      categorieChoisie: "",
    };
  },
  async created() {
    await this.fetchMois();
  },
  methods: {
    async fetchMois() {
    try {
      this.moisDisponibles = await getData("/mois");
    } catch (error) {
      console.error("❌ Impossible de charger les mois :", error);
      this.errorMessage = "Impossible de charger les mois.";
    }
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      this.errorMessage = "";
      this.successMessage = "";
      this.missingMatricules = [];
    },
    async uploadFile() {
  if (!this.selectedFile) {
    this.errorMessage = "Veuillez sélectionner un fichier.";
    return;
  }

  const formData = new FormData();
  formData.append("file", this.selectedFile);
  formData.append("mois", this.moisChoisi);
  formData.append("annee", this.anneeChoisie);
  formData.append("categorie", this.categorieChoisie);

  try {
    const data = await postFormData("/convert/upload", formData);

    this.successMessage = "✅ Données importées avec succès !";
    this.selectedFile = null;
    this.moisChoisi= "";
    this.categorieChoisie= "";
    this.missingMatricules = data.missing || [];
  }catch (error) {
        this.errorMessage = " Une erreur est survenue.";
        this.selectedFile = null;
        this.moisChoisi= "";
        this.categorieChoisie= "";
      }
    },
  },
};
</script>


<style scoped>
/* 🌍 Conteneur principal */
.import-container {
  background: #fff;
  border: 2px solid #E60F04;
  border-radius: 10px;
  padding: 30px;
  max-width: 500px; /* ✅ Taille ajustée pour bien centrer */
  margin: 10% auto 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  font-family: Arial, sans-serif;
}

/* 📌 Titres et labels */
.import-container h2 {
  color: #E60F04;
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
  font-weight: bold;
}

.import-container label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

/* 📌 Champs de formulaire (Select, Input, File) */
.import-container select,
.import-container input[type="number"],
.import-container input[type="file"] {
  width: 100%; /* ✅ Uniformise la largeur */
  padding: 12px;
  border: 2px solid #E60F04;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box; /* ✅ Évite que la taille change */
}

/* 📌 Spécifique pour l'input file */
.import-container input[type="file"] {
  border-style: dashed; /* ✅ Bordure en pointillés */
  padding: 8px;
  background: #fff;
  cursor: pointer;
  margin-top: 5%;
}

/* 📌 Bouton */
.import-container button {
  width: 100%;
  padding: 12px;
  background: #E60F04;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 10px;
}

.import-container button:hover {
  background: #C00D00;
}


/* ✅ Message de succès */
.success {
  color: #008000;
  font-weight: bold;
  margin-top: 15px;
}

/* ❌ Message d'erreur */
.error {
  color: #E60F04;
  font-weight: bold;
  margin-top: 15px;
}

/* 🔴 Liste des matricules manquants */
ul {
  padding: 10px;
  list-style: none;
  text-align: center;
}

ul li {
  background: #FFDC00;
  color: #333;
  padding: 5px;
  margin-top: 5px;
  border-radius: 5px;
  font-weight: bold;
}

</style>
