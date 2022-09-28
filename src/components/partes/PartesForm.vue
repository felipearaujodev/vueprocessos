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
            <a v-if="metodo == 'incluir'" class="submit-btn" href="javascript:void(0)" v-on:click="adicionarParteHtml">Adicionar</a>
            <a v-else-if="metodo == 'editar'" id="cadastrar-parte" class="submit-btn" href="javascript:void(0)" v-on:click="adicionarParteApi">Cadastrar</a>
        </div>
    </div>
</template>

<script>
    import validarCPF from "../../Helpers/validadorCpf.js";
    import api from '../../services/api.js'
    import { createToaster } from "@meforma/vue-toaster";

    const toaster = createToaster({ });

    export default {
        name: "PartesForm",
        props: {
            metodo: String,
            partesLista: Array,
            processoId: Number
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
            adicionarParteHtml() {

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
                    this.cpf = "";
                    this.nome = null;
                    this.sexo = "";
                }
            },
            async adicionarParteApi() {

                this.errors_partes = [];
                if(!this.nome){
                    this.errors_partes.push('O Nome é obrigatório.');
                }

                if(this.sigiloso){
                    

                    if(this.sexo == ""){
                        this.errors_partes.push('O Sexo é obrigatório.');
                    }

                    if(!validarCPF(this.cpf.replace(/[^a-z0-9]/gi, ""))){
                        this.errors_partes.push('O CPF é inválido.');
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
                    document.getElementById("cadastrar-parte").disabled = true;
                    await api.post('/processoPartes/', {
                        processoId: this.processoId,
                        sigiloso: this.sigiloso,
                        cpf: this.cpf,
                        nome: this.nome,
                        sexo: this.sexo
                    })
                    .then((response) => {
                        if(response.status >= 200 && response.status <= 299)
                        {
                            toaster.show("Parte cadastrada com sucesso!", {
                                type:"info",
                                position: "top"
                            });

                            this.partesLista.push({
                                id: response.data.id,
                                sigiloso: response.data.sigiloso,
                                cpf: response.data.cpf,
                                nome: response.data.nome,
                                sexo: response.data.sexo
                            });

                            this.sigiloso = false;
                            this.cpf = "";
                            this.nome = null;
                            this.sexo = "";
                            
                        }
                        else
                        {
                            toaster.show("Erro ao cadastrar!", {
                                type:"warning",
                                position: "top"
                            });
                            this.errors.push('Erro ao alterar.');
                        }
                    })
                    .catch((error) => {
                        console.log(error.response.data);
                        toaster.show("Erro ao alterar!", {
                            type:"warning",
                            position: "top"
                        });

                        this.errors.push('Erro ao alterar.');
                        
                    });

                    document.getElementById("cadastrar-parte").disabled = false;
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
