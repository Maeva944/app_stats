<template>
    <div class="login-container">
      <h1>Connexion</h1>
      <br /><br />
  
      <input type="email" placeholder="Email" v-model="email" />
      <div class="password-container">
      <input :type="showPassword ? 'text' : 'password'" placeholder="Mot de passe" v-model="password" />
      <button type="button" class="toggle-password" @click="togglePassword">
        {{ showPassword ? "Masquer" : "Afficher" }}
      </button>
      </div>
      <button @click="handleLogin" id="login-button">Se connecter</button>
  
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword; 
    },
    async handleLogin() {
      try {
        const response = await fetch("http://localhost:3000/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        const data = await response.json();

        if (response.status === 401) {
          this.errorMessage = data.error;
          return;
        }

        if (data.mustChangePassword) {
          this.$router.push(`/nouveaumdp?email=${this.email}`); 
          return;
        }

        localStorage.setItem("token", data.token); 
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = "Erreur lors de la connexion.";
      }
    },
  },
};
</script>
<style scoped>
/* 🌍 Conteneur principal */
.login-container {
  background: #fff;
  border: 2px solid #E60F04;
  border-radius: 10px;
  padding: 30px;
  max-width: 400px;
  margin: 100px auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  text-align: center;
  font-family: Arial, sans-serif;
}

/* 🏷️ Titre */
.login-container h1 {
  color: #E60F04;
  font-size: 26px;
  margin-bottom: 20px;
  font-weight: bold;
}

/* 📌 Champs de formulaire */
.login-container input {
  width: 100%;
  padding: 12px;
  border: 2px solid #E60F04;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
  margin-bottom: 15px;
}

/* 📌 Mot de passe avec bouton afficher/masquer */
.password-container {
  display: flex;
  align-items: center;
  width: 100%;
}

/* 📌 Champ mot de passe */
.password-container input {
  flex: 1;
  padding: 12px;
  border: 2px solid #E60F04;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

/* 👁️ Bouton "Afficher/Masquer" bien aligné */
.toggle-password {
  background: #FFDC00;
  border: none;
  padding: 12px 15px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  margin: 0 0 4% 2%; /* ✅ Évite que le bouton touche l'input */
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  background: #E6C500;
}

/* 🔴 Bouton Connexion */
#login-button {
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
}

#login-button:hover {
  background: #C00D00;
}

/* ❌ Message d'erreur */
.error {
  color: #E60F04;
  font-weight: bold;
  margin-top: 15px;
}

  </style>
  