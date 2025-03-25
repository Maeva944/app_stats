<template>
    <div class="form-container">
      <h2>Ajouter un Employé</h2>
  
      <label>Nom :</label>
      <input type="text" v-model="employe.nom" required />
  
      <label>Prénom :</label>
      <input type="text" v-model="employe.prenom" required />
  
      <label>Matricule :</label>
      <input type="number" v-model="employe.matricule" required />
  
      <label>Métier :</label>
      <select v-model="employe.metier_id">
        <option v-for="metier in metiers" :key="metier.id" :value="metier.id">
          {{ metier.nom }}
        </option>
      </select>
  
      <label>Email :</label>
      <input type="email" v-model="employe.email" required />

      <label>Mot de passe :</label>
      <input type="password" v-model="employe.mdp" required />
  
      <label>Rôle :</label>
      <select v-model="employe.role_id">
        <option v-for="role in roles" :key="role.id" :value="role.id">
          {{ role.nom }}
        </option>
      </select>
  
      <label>Photo de Profil :</label>
      <input type="file" @change="uploadPhoto" name="photo"/>
  
      <button @click="ajouterEmploye">Ajouter</button>
  
      <p v-if="message" :class="{ success: success, error: !success }">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import { getData, postFormData } from "../api";
  
  export default {
    data() {
      return {
        employe: {
          nom: "",
          prenom: "",
          matricule: "",
          metier_id: "",
          email: "",
          role_id: "",
          mdp: "",
          photo: null,
        },
        metiers: [],
        roles: [],
        message: "",
        success: false,
      };
    },
    async created() {
      await this.fetchMetiers();
      await this.fetchRoles();
    },
    methods: {
      async fetchMetiers() {
        try {
          this.metiers = await getData("/metiers");
        } catch (error) {
          console.error("Erreur chargement métiers :", error);
        }
      },
      async fetchRoles() {
        try {
          this.roles = await getData("/roles");
        } catch (error) {
          console.error("Erreur chargement rôles :", error);
        }
      },
      uploadPhoto(event) {
        this.employe.photo = event.target.files[0];
      },
      async ajouterEmploye() {
        if (!this.employe.nom || !this.employe.prenom || !this.employe.email || !this.employe.matricule) {
          this.message = "Veuillez remplir tous les champs obligatoires.";
          this.success = false;
          return;
        }
  
        const formData = new FormData();
        formData.append("nom", this.employe.nom);
        formData.append("mdp", this.employe.mdp);
        formData.append("prenom", this.employe.prenom);
        formData.append("matricule", this.employe.matricule);
        formData.append("metier_id", this.employe.metier_id);
        formData.append("email", this.employe.email);
        formData.append("role_id", this.employe.role_id);
        formData.append("must_change_password", "true"); 
        formData.append("photo", this.employe.photo);
  
  
        try {
          await postFormData("/add/ajout-employe", formData);
          this.message = "✅ Employé ajouté avec succès !";
          this.success = true;
          this.employe = { nom: "", prenom: "", matricule: "", metier_id: "", email: "", role_id: "", photo: null, mdp: "" };
        } catch (error) {
          this.message = "❌ Erreur lors de l'ajout.";
          this.success = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .form-container {
    background: #fff;
    padding: 5% 5%;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    max-width: 450px;
    margin: 10% auto;
    font-family: 'Arial', sans-serif;
    border: 1px solid #c00d00;
  }

  label {
    display: block;
    margin-top: 15px;
    font-weight: bold;
    color: #333;
  }

  input, select {
    width: 100%;
    padding: 12px;
    margin-top: 8px;
    border: 1px solid #c2bfbf;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;
  }

  select{
    width: 106%;
  }

  input:focus, select:focus {
    border-color: #007bff;
    outline: none;
  }

  button {
    width: 105%;
    background-color: #e60f04;
    color: #fff;
    padding: 12px;
    margin-top: 20px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #c00d00;
  }

  .success {
    color: green;
    font-size: 14px;
    margin-top: 12px;
  }

  .error {
    color: red;
    font-size: 14px;
    margin-top: 12px;
  }
</style>

  