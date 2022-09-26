<template>

        <div class="container">
            <h1>Detalhes do processo</h1>
            <div>
                <a href="/processos" class="back-btn">Voltar</a>
            </div>
            <form id="processo-form" @submit="salvarProcesso">
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
                    <textarea id="obs" name="obs" v-model="obs" placeholder="Observações" rows="5" cols="50">At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.</textarea>    
                </div>

                <div class="input-container">
                    <label for="doc_nome">Documento</label>
                    <a v-bind:download="doc_nome" v-bind:href="doc" target="_blank">{{doc_nome}}</a>
                </div>

                <div class="input-container">
                    <label for="doc">Substituir documento: <sup>*</sup></label>
                    <input 
                        type="file" 
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
                    <input type="submit" class="submit-btn" value="Salvar">
                </div>

                <div class="history">
                    <router-link class="link-history" :to="{name: 'processo-historico', params:{ processoid: this.$route.params.id}}">Histórico</router-link>
                </div>

                <div>
                    <router-view></router-view>
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
        name: "ProcessoDetalhe",
        components: {
            PartesForm
        },
        data() {
            return {
                numero: 0,
                data: null,
                tipo: "",
                obs: null,
                doc_nome: null,
                doc: ref(File | null),
                msg: null,
                errors: []
            }
        },
        methods: {
            async salvarProcesso(e){

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

                

                await api.put('/processo/'+this.$route.params.id, {
                    numero: this.numero.toString(),
                    data: this.data,
                    tipo: this.tipo,
                    observacoes: this.obs,
                    documentoNome: this.doc_nome,
                    documento: this.doc,
                    partes: []
                })
                .then((response) => {
                    if(response.status >= 200 && response.status <= 299)
                    {
                        toaster.show("Processo alterado com sucesso!", {
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
                    setTimeout(()=>{
                        window.location.href = "/processos";
                    }, 2000)
                    
                }
                
            },
            async fileUpload(e){
                console.log(e);
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
            async processo(id){
                await api.get('/processo/'+id)
                .then((response) => {
                    this.data = response.data.data;
                    this.numero = response.data.numero;
                    this.tipo = response.data.tipo;
                    this.obs = response.data.observacoes;
                    this.doc_nome = response.data.documentoNome;
                    this.doc = response.data.documento;
                    
                })
                .catch((error) => {
                    console.log(error);
                    let mensagem = "Tempo excedido, tente novamente mais tarde";
                    if(error.hasOwnProperty("response"))
                    {
                        mensagem = error.response.status + ' - ' + error.response.data;
                    }

                    toaster.show(mensagem, {
                            type:"error",
                            position: "top"
                        });            
                });
            }
        },
        mounted() {
            this.processo(this.$route.params.id);

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
    }

    .link-history:hover {
        background-color: transparent;
        color: black;
    }

    .history {
        margin-top: 30px
    }
</style>