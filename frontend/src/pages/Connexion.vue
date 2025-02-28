<template>
    <div class="login-container">
      <h1>Connexion</h1>
      <br /><br />
  
      <input type="email" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Mot de passe" v-model="password" />
      <button @click="handleLogin">Se connecter</button>
  
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
    };
  },
  methods: {
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
  .login-container {
    max-width: 300px;
    margin: auto;
    text-align: center;
  }
  
  input {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
  }
  
  button {
    width: 100%;
    padding: 8px;
    background: blue;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .error {
    color: red;
  }
  </style>
  