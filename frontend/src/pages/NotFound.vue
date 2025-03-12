<template>
    <div class="notfound-container">
      <h1 class="error-code">404</h1>
      <p class="error-message">Oups ! La page que vous cherchez n'existe pas.</p>
      <router-link to="/" class="home-button">Retour à l'accueil</router-link>
    </div>
  </template>
  
  <script setup></script>
  
  <style scoped>
  .notfound-container {
    text-align: center;
    background: linear-gradient(135deg, #E60F04, #FFDC00);
    color: white;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: "Arial", sans-serif;
  }
  
  .error-code {
    font-size: 100px;
    font-weight: bold;
    color: #fff;
    text-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .error-message {
    font-size: 22px;
    margin-top: -10px;
    color: #fff;
  }
  
  /* 🔘 Bouton de retour */
  .home-button {
    margin-top: 20px;
    padding: 12px 24px;
    font-size: 18px;
    background: #fff;
    color: #E60F04;
    border: 2px solid #fff;
    border-radius: 25px;
    text-decoration: none;
    font-weight: bold;
    transition: 0.3s ease;
  }
  
  .home-button:hover {
    color: #E60F04;
    border-color: #E60F04;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  }
  </style>
  