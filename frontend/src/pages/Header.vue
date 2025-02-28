<template>
    <header>
        <h1>VDE Tech</h1>
      <nav>
        <router-link to="/" id="home" v-if="isLoggedIn">Accueil</router-link>
        <!--<router-link to="/profil">Profil</router-link>-->
        <button v-if="isLoggedIn" @click="logout">Déconnexion</button>
      </nav>
    </header>
</template>
  
<script>
  export default {
    data() {
    return {
      isLoggedIn: !!localStorage.getItem("token") // ✅ Vérifie si un token est stocké
    };
    },
    methods: {
      logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        this.$router.push("/connexion"); 
      }
    },
    watch: {
    '$route'() {
      this.isLoggedIn = !!localStorage.getItem("token");
    }
    }
  };
</script>
  
<style scoped>
header{
    display: flex;
    justify-content: space-between;
    color: #E60F04;
}
h1{
    width: 50%;
}
  nav {
  padding: 10px;
  width: 60%;
  position : fixe;
  right: 0;
  text-align:right;

}
button {
    background: #E60F04;
    color: white;
    border: none;
    padding: 2% 1%;
    cursor: pointer;
    width: 45%;
    margin-left: 5%;
}
#home{
    text-decoration:none;
    font-size:15pt;
    color: #333333;
}
</style>
  