<template>
    <div>
      <h2>Liste des Techniciens</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Nom</th>
            <th>VAPS</th>
            <th>Détails</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tech in techniciens" :key="tech.id">
            <td>{{ tech.nom }}</td>
            <td>{{ tech.vaps }}</td>
            <td>
              <router-link :to="'/technicien/' + tech.id">Voir Détails</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        techniciens: []
      };
    },
    async created() {
      try {
        const response = await fetch("http://localhost:3000/techniciens");
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        this.techniciens = await response.json();
      } catch (error) {
        console.error("Erreur lors de la récupération des techniciens :", error);
      }
    }
  };
  </script>
  

  
  