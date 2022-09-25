<template>

        <div class="container">
            <h1>Cadastro</h1>
            <div>
                <a href="/processos" class="new-btn">Voltar</a>
            </div>
            <form id="processo-form" @submit="criarProcesso">
                <div class="input-container">
                    <label for="nome">Número <sup>*</sup></label>
                    <input type="number" id="numero" name="numero" v-model="numero" placeholder="Digite o número do processo">       
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
    import PartesForm from "./PartesForm.vue";
    import api from '../services/api';
    import { createToaster } from "@meforma/vue-toaster";

    const toaster = createToaster({ });

    export default {
        name: "ProcessoForm",
        components: {
            PartesForm
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

                if (this.data && this.numero && this.tipo.length && this.doc.length ) {
                    this.errors.pop();
                    
                }

                e.preventDefault();

                

                await api.post('/processo', {
                    numero: this.numero.toString(),
                    data: this.data,
                    tipo: this.tipo,
                    obs: this.obs,
                    documentoNome: this.doc_nome,
                    documento: this.doc,
                    partes: []
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

                
                if(!this.errors.length)
                {
                    window.location.href = "/processos";
                }
                
            },
            async fileUpload(e){
                console.log(e.target.files[0]);
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

    .new-btn {
        background-color: black;
        color: coral;
        font-weight: bold;
        border: 2px solid black;
        padding: 10px;
        font-size: 16px;
        margin: 10 auto;
        cursor: pointer;
        transition: 0.5s;
    }

    .new-btn:hover {
        background-color: transparent;
        color: coral;
    }
</style>