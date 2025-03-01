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
<style>
body {
  background-color: #eeecec;
}
h1 {
  color: #333;
}
.login-container {
  max-width: 290px;
  margin: auto;
  text-align: center;
  padding: 15%;
  margin-top: 15%;
  background-color: #f4f1f1;
}
.login-container input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
#login-button {
  min-width: 106%;
  padding: 10px;
  background: #1F68DE;
  color: white;
  border: none;
  cursor: pointer;
}
.login-container .password-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 107.5%;
}
.login-container .password-container input {
  flex: 1;
}
.login-container .toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: -1px;
  top: 8px;
  font-size: 16px;
  color: #1F68DE;
  width: 25%;
}
.error {
  color: red;
}
  </style>
  