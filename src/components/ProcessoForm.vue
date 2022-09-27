<template>

        <div class="container">
            <h1>Cadastro</h1>
            <div>
                <a href="/processos" class="back-btn">Voltar</a>
            </div>
            <form id="processo-form" @submit="criarProcesso">
                <div class="input-container">
                    <label for="numero">Número <sup>*</sup></label>
                    <input type="number" id="numero" name="numero" maxlength="10" v-model="numero" placeholder="Digite o número do processo">       
                </div>
                <div class="input-container">
                    <label for="data">Data <sup>*</sup></label>
                    <input type="datetime-local" id="data" name="data" v-model="data" placeholder="Seleciona uma data">       
                </div>
                <div class="input-container">
                    <label for="tipo">Tipo <sup>*</sup></label>
                    <select name="tipo" id="tipo" v-model="tipo">
                        <option value="">Selecione o tipo</option>
                        <option value="judicial">Judicial</option>
                        <option value="extrajudicial">Extra judicial</option>
                    </select>
                </div>
                <div class="input-container">
                    <label for="parte">Parte</label>
                    <div class="input-container-part">
                        <label for="sigiloso">Sigiloso</label>
                        <input type="checkbox" id="sigiloso" name="sigiloso" v-model="sigiloso">
                        <label for="cpf">CPF</label>
                        <input type="text" id="cpf" name="cpf" v-model="cpf" placeholder="CPF">            
                        <label for="nome">Nome</label>
                        <input type="text" id="nome" name="nome" v-model="nome" placeholder="Nome completo">       
                        <label for="sexo">Sexo</label>
                        <select name="sexo" id="sexo" v-model="sexo">
                            <option value="">Selecione o sexo</option>
                            <option value="masculino">Masculino</option>
                            <option value="feminino">Feminino</option>
                            <option value="ignorado">Não informar</option>
                        </select>
                        <a class="submit-btn" href="javascript:void(0)" v-on:click="adicionarParte">Adicionar</a>
                    </div>
                </div>
                <PartesList :key="parte" :partesLista="this.partes" />
                <div class="input-container">
                    <label for="obs">Observações</label>
                    <input type="text" id="obs" name="obs" v-model="obs" placeholder="Observações">       
                </div>
                <div class="input-container">
                    <label for="doc">Selecione o documento: <sup>*</sup></label>
                    <input 
                        type="file" 
                        ref="file"
                        v-on:change="fileUpload($event)" 
                        id="doc" 
                        name="doc">
                </div>

                <p v-if="errors.length">
                    <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
                    <ul>
                    <li v-for="error in errors">{{ error }}</li>
                    </ul>
                </p>
                <div>
                    <input type="submit" class="submit-btn" value="Criar Processo">
                </div>
            </form>
        </div>

    
</template>

<script>
    import { ref } from "vue";
    import PartesList from "./PartesList.vue";
    import api from '../services/api';
    import { createToaster } from "@meforma/vue-toaster";

    const toaster = createToaster({ });

    export default {
        name: "ProcessoForm",
        components: {
            PartesList
        },
        data() {
            return {
                numero: 0,
                data: null,
                tipo: "",
                obs: null,
                doc: ref(File | null),
                doc_nome: "",
                msg: null,
                sigiloso: false,
                cpf: null,
                nome: null,
                sexo: "",
                parte: 0,
                partes: [],
                errors: []
            }
        },
        methods: {
            async criarProcesso(e){

                this.errors = [];

                if (!this.data) {
                    this.errors.push('A Data é obrigatória.');
                }

                if (!this.numero) {
                    this.errors.push('O Número é obrigatório.');
                }

                if (this.tipo === "") {
                    this.errors.push('O Tipo é obrigatório.');
                }

                if (!this.doc) {
                    this.errors.push('O Documento é obrigatório.');
                }

                if (!this.partes.length) {
                    this.errors.push('Informe ao menos uma parte.');
                }

                if (this.data && this.numero && this.tipo.length && this.doc.length && this.partes.length ) {
                    this.errors.pop();
                    
                }

                e.preventDefault();

                
                if(!this.errors.length)
                {
                    await api.post('/processo', {
                        numero: this.numero.toString(),
                        data: this.data,
                        tipo: this.tipo,
                        observacoes: this.obs,
                        documentoNome: this.doc_nome,
                        documento: this.doc,
                        partes: this.partes
                    })
                    .then((response) => {
                        if(response.status >= 200 && response.status <= 299)
                        {
                            toaster.show("Processo cadastrado com sucesso!", {
                                type:"info",
                                position: "top"
                            });
                        }
                        else
                        {
                            toaster.show("Erro ao cadastrar!", {
                                type:"error",
                                position: "top"
                            });
                            this.errors.push('Erro ao cadastrar.');
                        }
                    })
                    .catch((error) => {
                        toaster.show("Erro ao cadastrar!", {
                                type:"error",
                                position: "top"
                            });

                            this.errors.push('Erro ao cadastrar.');
                        
                    });
                }

                
                if(!this.errors.length)
                {
                    setTimeout(()=>{
                        window.location.href = "/processos";
                    },2000);
                    
                }
                
            },
            async fileUpload(e){
                this.doc_nome = e.target.files[0].name;
                
                this.blobToBase64(e.target.files[0]).then(res=>{
                    this.doc = res;
                    
                }, falha => {
                    this.doc = '';
                });
            },
            blobToBase64(blob) {
                return new Promise((resolve, _) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            },
            adicionarParte() {
                this.partes.push(
                    {
                        sigiloso: this.sigiloso,
                        cpf: this.cpf,
                        nome: this.nome,
                        sexo: this.sexo
                    }
                );
            }
        },
        mounted() {
            
        }
    }
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

    .container > div {
        margin: 10px
    }

    #processo-form {
        max-width: 400px;
        margin: 10px auto;
    }
    .input-container {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

    .input-container > label {
        font-weight: bold;
        margin-bottom: 15px;
        color:#222;
        padding: 5px 10px;
        border-left: 4px solid coral;
    }


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

    input, select {
        padding: 5px 10px;
        
    }

    sup {
        color: red;
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
    }

    .submit-btn:hover {
        background-color: transparent;
        color: black;
    }

    
</style>