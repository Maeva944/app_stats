<template>
  <div class="import-container">
    <h2>Importer des Statistiques</h2>

    <label for="categorie">Veuillez choisir une catégorie :</label>
    <select v-model="categorieChoisie" id="categorie">
        <option value="Qualité Techniques">Qualité Techniques</option>
        <option value="NPS">NPS</option>
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
    this.missingMatricules = data.missing || [];
  }catch (error) {
        this.errorMessage = " Une erreur est survenue.";
      }
    },
  },
};
</script>


<style scoped>
.import-container {
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.import-container h2 {
  margin-bottom: 15px;
}

.import-container input,
.import-container select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.import-container button {
  width: 100%;
  padding: 10px;
  background-color: #1F68DE;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.import-container button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}

.success {
  color: green;
  margin-top: 10px;
  font-weight: bold;
}

ul {
  text-align: left;
  margin-top: 10px;
}
</style>
