<template>
    <div>
      <h2>Changer votre mot de passe</h2>
  
      <!-- 🔹 Champ pour l'ancien mot de passe -->
      <input 
        type="password" 
        v-model="oldPassword" 
        placeholder="Ancien mot de passe"
      />
  
      <!-- 🔹 Champ pour le nouveau mot de passe -->
      <input 
        type="password" 
        v-model="newPassword" 
        placeholder="Nouveau mot de passe" 
        @input="validatePassword"
      />
  
      <!-- 🔹 Liste des critères de validation -->
      <ul>
        <li :style="{ color: hasMinLength ? 'green' : 'red' }">✔️ Au moins 10 caractères</li>
        <li :style="{ color: hasUpperCase ? 'green' : 'red' }">✔️ Une majuscule (A-Z)</li>
        <li :style="{ color: hasLowerCase ? 'green' : 'red' }">✔️ Une minuscule (a-z)</li>
        <li :style="{ color: hasNumber ? 'green' : 'red' }">✔️ Un chiffre (0-9)</li>
        <li :style="{ color: hasSpecialChar ? 'green' : 'red' }">✔️ Un caractère spécial (@, $, !, %, *, ?, &)</li>
      </ul>
  
      <button 
        @click="changePassword" 
        :disabled="!isPasswordValid"
      >Valider</button>
  
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        oldPassword: "", 
        newPassword: "",
        message: "",
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        isdifferent: false,
      };
    },
    computed: {
      isPasswordValid() {
        return this.hasMinLength && this.hasUpperCase && this.hasLowerCase && this.hasNumber && this.hasSpecialChar;
      }
    },
    methods: {
      validatePassword() {
        this.hasMinLength = this.newPassword.length >= 10;
        this.hasUpperCase = /[A-Z]/.test(this.newPassword);
        this.hasLowerCase = /[a-z]/.test(this.newPassword);
        this.hasNumber = /[0-9]/.test(this.newPassword);
        this.hasSpecialChar = /[@$!%*?&]/.test(this.newPassword);
        this.isdifferent = this.oldPassword !== this.newPassword
      },
      async changePassword() {
        const username = this.$route.query.username;
  
        if (!this.oldPassword) {
          this.message = "❌ L'ancien mot de passe est requis.";
          return;
        }
  
        if (!this.isPasswordValid) {
          this.message = "❌ Le nouveau mot de passe ne respecte pas les critères.";
          return;
        }
  
        try {
          const response = await fetch("http://localhost:3000/password/change", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              username, 
              oldPassword: this.oldPassword, // ✅ Envoie l'ancien mot de passe
              newPassword: this.newPassword 
            }),
          });
  
          const data = await response.json();
          this.message = data.message;
  
          if (response.ok) {
            this.$router.push("/connexion");
          }
        } catch (error) {
          this.message = "Erreur lors du changement de mot de passe.";
        }
      }
    }
  };
  </script>
  