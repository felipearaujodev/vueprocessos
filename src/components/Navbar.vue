
    
<template>
  <div id="nav">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/processos">Processos</RouterLink>
  </div>
</template>



<style scoped>
  #nav {
    background-color: black;
    border-bottom: 4px solid #000;
    padding: 15px 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  #nav a {
    color:coral;
    text-decoration: none;
    margin: 17px;
    transition: .10s;
  }
  #nav a:hover {
    color:aliceblue
  }
</style>

<script>

  export default {
    name: "Navbar"
  }
</script>
    