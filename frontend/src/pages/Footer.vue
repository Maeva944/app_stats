<template>
    <footer>
      <p>&copy 2025 - VDE Tech</p>
    </footer>
</template>
  
<script>
  export default {};
</script>
  
<style scoped>
/* 🌍 Assurer que toute la page prend au moins la hauteur complète */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* ✅ S'assurer que #app prend toute la hauteur et pousse le footer en bas */
#app {
  display: flex;
  flex-direction: column;
  min-height: 200vh;
}

/* ✅ Permet au contenu de prendre l’espace disponible */
main {
  flex: 1; /* ✅ Pousse le footer vers le bas */
}

/* 📌 Footer bien positionné en bas, mais pas collé */
footer {
  background: #333333;
  color: white;
  text-align: center;
  padding: 15px 0;
  width: 100%;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.2);
}

</style>
  