<template>
  <div class="form-container">
    <!-- Premier formulaire : Importation des statistiques -->
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

      <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
      <button @click="uploadFile">Importer</button>

      <!-- ✅ Affichage des messages d'erreur et de succès -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>

    <!-- Deuxième formulaire : Importation des services conso et commentaires -->
    <div class="import-container-com-conso">
      <h2>Importer des Statistiques</h2>
      <label for="categoriecomconso">Veuillez choisir une catégorie :</label>
      <select v-model="categorieChoisieComConso" id="categoriecomconso">
        <option value="Services Conso">Services Conso</option>
        <option value="Commentaires">Commentaires</option>
      </select>

      <label for="anneeTwo">Année :</label>
      <input type="number" id="anneeTwo" v-model="anneeChoisieComConso" min="2000" max="2100" />

      <input type="file" @change="handleFileUploadComConso" accept=".xlsx, .xls" />
      <button @click="uploadFileComConso">Importer</button>

      <!-- ✅ Affichage des messages d'erreur et de succès -->
      <p v-if="errorMessageComConso" class="error">{{ errorMessageComConso }}</p>
      <p v-if="successMessageComConso" class="success">{{ successMessageComConso }}</p>
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
      anneeChoisieComConso: new Date().getFullYear(),
      anneeChoisie: new Date().getFullYear(),
      selectedFile: null,
      selectFileComConso: null,
      errorMessage: "", 
      successMessage: "",
      errorMessageComConso: "", 
      successMessageComConso: "", 
      missingMatricules: [],
      categorieChoisie: "",
      categorieChoisieComConso: "",
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

    this.successMessage = "Données importées avec succès !";
    this.selectedFile = null;
    this.moisChoisi= "";
    this.categorieChoisie= "";
    this.missingMatricules = data.missing || [];
  }catch (error) {
        this.errorMessage = " Une erreur est survenue.";
        this.selectedFile = null;
        this.moisChoisi= "";
        this.categorieChoisie= "";
        console.log(error);
      }
    },
    handleFileUploadComConso(event) {
      this.selectFileComConso = event.target.files[0];
      this.errorMessageComConso = "";
      this.successMessageComConso = "";
      this.missingMatricules = [];
    },
    async uploadFileComConso(){
      if(!this.selectFileComConso){
        this.errorMessageComConso="Veuillez sélectionner un fichier.";
        return;
      }

      const FormDataTwo = new FormData();
      FormDataTwo.append("file", this.selectFileComConso);
      FormDataTwo.append("anneeTwo", this.anneeChoisieComConso);
      FormDataTwo.append("categorieTwo", this.categorieChoisieComConso);
      
      console.log("📤 FormData envoyé :", [...FormDataTwo.entries()]); 

      try{
        const data = await postFormData("/converttwo/upload-comconso", FormDataTwo);
        this.successMessageComConso = "Données importées avec succès !";
        this.selectFileComConso = null;
        this.categorieChoisieComConso= "";
        this.missingMatricules = data.missing || [];

      }catch(error){
        this.errorMessageComConso = " Une erreur est survenue.";
        console.log(error);
        this.selectFileComConso = null;
        this.categorieChoisieComConso= "";
      }
    }
  },
};
</script>


<style scoped>
/* 🌍 Conteneur principal pour les formulaires */
.form-container {
  display: flex;
  justify-content: center; /* ✅ Centre bien les formulaires */
  align-items: flex-start; /* ✅ Alignement en haut */
  gap: 30px; /* ✅ Espacement uniforme entre les formulaires */
  flex-wrap: wrap; /* ✅ Passe en colonne sur mobile */
  margin-top: 10%;
  width: 100%;
}

/* 📌 Formulaires : même taille et alignement */
.import-container,
.import-container-com-conso {
  flex: 1; /* ✅ Permet aux formulaires de prendre la même largeur */
  max-width: 500px; /* ✅ Largeur max identique */
  min-width: 450px; /* ✅ Empêche qu'ils deviennent trop petits */
  background: #fff;
  border: 2px solid #E60F04;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* ✅ Alignement parfait interne */
}

/* 📌 Titres et labels */
.import-container h2,
.import-container-com-conso h2 {
  color: #E60F04;
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
  font-weight: bold;
}

.import-container label,
.import-container-com-conso label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

/* 📌 Champs de formulaire (Select, Input, File) */
.import-container select,
.import-container input[type="number"],
.import-container input[type="file"],
.import-container-com-conso select,
.import-container-com-conso input[type="number"],
.import-container-com-conso input[type="file"] {
  width: 100%; /* ✅ Assure un alignement parfait */
  padding: 12px;
  border: 2px solid #E60F04;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box; /* ✅ Empêche la déformation */
}

/* 📌 Style spécifique pour l'input file */
.import-container input[type="file"],
.import-container-com-conso input[type="file"] {
  border-style: dashed;
  padding: 8px;
  background: #fff;
  cursor: pointer;
  margin-top: 5%;
  text-align: center;
}

/* 📌 Boutons */
.import-container button,
.import-container-com-conso button {
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

.import-container button:hover,
.import-container-com-conso button:hover {
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
