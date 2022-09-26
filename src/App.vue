<script>
  import Navbar from './components/Navbar.vue'
  import Footer from './components/Footer.vue'

  export default {
    components:{
      Navbar,
      Footer
    }
  }
</script>

<template>
  <Navbar />
  <RouterView />
  <Footer />
  

</template>

<style>
  
  .main-container {
    margin: 50px;
    min-height: 250px;
  }

  h1 {
    text-align: center;
    font-size: 42px;
    margin-bottom: 30px;
    color:black;
  }

  .back-btn {
    background-color: black;
    color: coral;
    font-weight: bold;
    border: 2px solid black;
    padding: 10px;
    font-size: 16px;
    margin: 10 auto;
    cursor: pointer;
    transition: 0.5s;
    text-decoration: none;
  }

  .back-btn:hover {
    background-color: transparent;
    color: coral;
  }

  .link-history {
    background-color: black;
    color: gold;
    font-weight: bold;
    border: 2px solid black;
    padding: 10px;
    font-size: 16px;
    margin: 0 auto;
    cursor: pointer;
    transition: 0.5s;
    text-decoration: none;
  }

  .link-history:hover {
    background-color: transparent;
    color: black;
  }

  .submit-btn {
    background-color: black;
    color: coral;
    font-weight: bold;
    border: 2px solid black;
    padding: 10px;
    font-size: 16px;
    margin: 0 auto;
    cursor: pointer;
    transition: 0.5s;
    text-decoration: none;
  }

  .submit-btn:hover {
    background-color: transparent;
    color: black;
  }
  
</style>
