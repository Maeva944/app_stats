<template>
    <Header /> 
    <router-view />
    <Footer /> 
</template>
<script>
import Header from "./pages/Header.vue";
import Footer from "./pages/Footer.vue";

export default {
  components: {
    Header,
    Footer
  }
};
</script>
<style></style>
