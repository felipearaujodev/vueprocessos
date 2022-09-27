<template>
    <div class="input-container">
        <label for="parte">Parte</label>
        <div class="input-container-part">
            <label for="sigiloso">Sigiloso</label>
            <input type="checkbox" id="sigiloso" name="sigiloso" v-model="sigiloso">
            <label for="cpf">CPF</label>
            <input type="text" id="cpf" name="cpf" v-model="cpf" placeholder="CPF" maxlength="11">
            <label for="nome">Nome</label>
            <input type="text" id="nome" name="nome" v-model="nome" placeholder="Nome completo">       
            <label for="sexo">Sexo</label>
            <select name="sexo" id="sexo" v-model="sexo">
                <option value="">Selecione o sexo</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="ignorado">Não informado</option>
            </select>
            <p v-if="errors_partes.length">
                <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
                <ul>
                <li v-for="error in errors_partes">{{ error }}</li>
                </ul>
            </p>
            <a class="submit-btn" href="javascript:void(0)" v-on:click="adicionarParte">Adicionar</a>
        </div>
    </div>
</template>

<script>
    import validarCPF from "../Helpers/validadorCpf.js";

    export default {
        name: "PartesForm",
        props: {
            metodo: String,
            partesLista: Array
        },
        data(){
            return {
                sigiloso: false,
                cpf: "",
                nome: null,
                sexo: "",
                errors_partes: []
            }
        },
        methods:{
            adicionarParte() {

                this.errors_partes = [];
                if(!this.nome){
                    this.errors_partes.push('O Nome é obrigatório.');
                }

                
                if(this.sigiloso){

                    console.log(validarCPF(this.cpf.replace(/[^a-z0-9]/gi, "")))
                    if(!validarCPF(this.cpf.replace(/[^a-z0-9]/gi, ""))){
                        
                        this.errors_partes.push('O CPF é inválido.');
                    }

                    if(this.sexo == ""){
                        this.errors_partes.push('O Sexo é obrigatório.');
                    }

                    if (this.nome && validarCPF(this.cpf.replace(/[^a-z0-9]/gi, "")) && this.sexo.length) {

                        this.errors_partes = [];
                    }
                }
                else if(this.cpf)
                {
                    if(!validarCPF(this.cpf.replace(/[^a-z0-9]/gi, ""))){
                        this.errors_partes.push('O CPF é inválido.');
                    }
                }

                if(!this.errors_partes.length)
                {
                    this.partesLista.push(
                        {
                            sigiloso: this.sigiloso,
                            cpf: this.cpf,
                            nome: this.nome,
                            sexo: this.sexo
                        }
                    );

                    this.sigiloso = false;
                    this.cpf = null;
                    this.nome = null;
                    this.sexo = "";
                }
            }
        },
        mounted(){
        }
    }
</script>

<style scoped>
    .input-container-part {
        display: flex;
        flex-direction: column;
        margin: 10px;
        border: 1px solid #dddddd;
        border-radius: 10px;
        padding: 10px;
    }
    .input-container-part > label {
        font-weight: bold;
        margin-bottom: 7px;
        color:#222;
        padding: 2px 8px;
        border-left: 4px solid black;
    }

    .input-container-part > input, select {
        margin-bottom: 10px;
    }
</style>
