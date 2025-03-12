<template>
  <div class="container-mdp">
    <h2>Changer votre mot de passe</h2>

    <div class="mdp-container">
      <input :type="showOldPassword ? 'text' : 'password'" v-model="oldPassword" placeholder="Ancien mot de passe" />
      <button type="button" class="toggle-mdp" @click="showOldPassword = !showOldPassword">
        {{ showOldPassword ? "Masquer" : "Afficher" }}
      </button>
    </div>

    <div class="password-container">
      <input :type="showNewPassword ? 'text' : 'password'" v-model="newPassword" placeholder="Nouveau mot de passe" @input="validatePassword" />
      <button type="button" class="toggle-mdp" @click="showNewPassword = !showNewPassword">
        {{ showNewPassword ? "Masquer" : "Afficher" }}
      </button>
    </div>

    <ul>
      <li :style="{ color: hasMinLength ? 'green' : 'red' }"> Au moins 10 caractères</li>
      <li :style="{ color: hasUpperCase ? 'green' : 'red' }"> Une majuscule (A-Z)</li>
      <li :style="{ color: hasLowerCase ? 'green' : 'red' }"> Une minuscule (a-z)</li>
      <li :style="{ color: hasNumber ? 'green' : 'red' }"> Un chiffre (0-9)</li>
      <li :style="{ color: hasSpecialChar ? 'green' : 'red' }"> Un caractère spécial (@, $, !, %, *, ?, &)</li>
    </ul>

    <button @click="changePassword" :disabled="!isPasswordValid">Valider</button>

    <!-- ✅ Affichage des erreurs et messages -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="message" class="success">{{ message }}</p>
  </div>
</template>

<script>
export default {
data() {
  return {
    oldPassword: "", 
    newPassword: "",
    errorMessage: "",
    message: "",
    showOldPassword: false, 
    showNewPassword: false, 
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
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
  },
  async changePassword() {
    const email = this.$route.query.email;
    this.message = "";
    this.errorMessage = "";

    if (!this.oldPassword) {
      this.errorMessage = "L'ancien mot de passe est requis.";
      return;
    }

    if (!this.isPasswordValid) {
      this.errorMessage = "Le nouveau mot de passe ne respecte pas les critères.";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/password/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          oldPassword: this.oldPassword,
          newPassword: this.newPassword 
        }),
      });

      const data = await response.json();

      if (response.status === 400 || response.status === 401) {
        this.errorMessage = data.error;
        return;
      }

      if (response.ok) {
        this.message = "Mot de passe changé avec succès. Redirection...";
        setTimeout(() => {
          this.$router.push("/connexion");
        }, 2000);
      }
    } catch (error) {
      this.errorMessage = "Erreur lors du changement de mot de passe.";
    }
  }
}
};
</script>

<style scoped>
.container-mdp {
  width: 90%;
  max-width: 400px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
  margin: 10% auto;
}

/* 🔹 Titre */
h2 {
  color: #333;
  margin-bottom: 15px;
}

/* 🔹 Conteneur des inputs */
.mdp-container, .password-container {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
  width: 100%;
}

/* 🔹 Champs input */
.container-mdp input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

/* 🔹 Bouton "Afficher/Masquer" bien aligné à droite */
.container-mdp .toggle-mdp {
  position: absolute;
  right: 1px;
  top: 12%;
  width: 20%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 14px;
  color: #1F68DE;
  cursor: pointer;
  font-weight: bold;
}

/* 🔹 Liste des critères */
ul {
  list-style: none;
  padding: 0;
  text-align: left;
  margin-top: 10px;
}

ul li {
  font-size: 14px;
  margin: 5px 0;
}

/* 🔹 Bouton Valider */
.container-mdp button {
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background-color: #1F68DE;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

/* 🔹 Messages d'erreur et de succès */
.error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}

.success {
  color: green;
  font-weight: bold;
  margin-top: 10px;
}

</style>
