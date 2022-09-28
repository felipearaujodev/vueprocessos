<template>
  <div class="main-container">
    <h1>PROCESSOS</h1>
    <ProcessoList />
  </div>
</template>

<script>
import ProcessoForm from "../components/processo/ProcessoForm.vue";
import ProcessoList from "../components/processo/ProcessoList.vue";

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
