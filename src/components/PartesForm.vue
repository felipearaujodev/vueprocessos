<template>
    <div>
        <p>Partes</p>
        <div>
            <form action="#" id="processo-form">
                <div id="opcionais-container" class="checkbox-container">
                    <label id="opcionais-title" for="sigiloso">Sigiloso</label>
                    <input type="checkbox" id="sigiloso" name="sigiloso" v-model="sigiloso">       
                </div>
                <div class="input-container">
                    <label for="data">CPF</label>
                    <input type="date" id="cpf" name="cpf" v-model="cpf" placeholder="###.###.###-##">       
                </div>
                <div class="input-container">
                    <label for="nome">Nome</label>
                    <input type="text" id="nome" name="nome" v-model="nome" placeholder="Digite seu nome">       
                </div>
                <div class="input-container">
                    <label for="sexo">Sexo</label>
                    <input type="text" id="obs" name="obs" v-model="obs" placeholder="Observações">       
                </div>
                <div class="input-container">
                    <label for="doc">Selecione o documento:</label>
                    <input type="file" id="doc" name="doc" v-on="doc">
                </div>

            </form>
        </div>
    </div>
    
</template>

<script>
    export default {
        name: "PartesForm"
    }
</script>

<style scoped>
    #processo-form {
        max-width: 400px;
        margin: 0 auto;
    }
    .input-container {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

    label {
        font-weight: bold;
        margin-bottom: 15px;
        color:#222;
        padding: 5px 10px;
        border-left: 4px solid coral;
    }

    input, select {
        padding: 5px 10px;
        width: 300px;
    }

    #opcionais-container {
        flex-direction: row;
        flex-wrap: wrap;
    }

    #opcionais-title {
        width: 100%;
    }

    .checkbox-container {
        display: flex;
        align-items: flex-start;
        width: 50%;
        margin-bottom: 20px;
    }

    .checkbox-container span,
    .checkbox-container input {
        width: auto;
    }

    .checkbox-container span {
        margin-left: 6px;
        font-weight: bold;
    }

</style>