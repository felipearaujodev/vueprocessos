<template>
  <div class="main-container">
    <h1>PROCESSOS</h1>
    <ProcessoList />
  </div>
</template>

<script>
import ProcessoForm from "../components/ProcessoForm.vue";
import ProcessoList from "../components/ProcessoList.vue";

export default {
  name: "ProcessosView",
  components: {
    ProcessoForm,
    ProcessoList
  }

}
</script>
<style>

</style>
