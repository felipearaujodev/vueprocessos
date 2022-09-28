<template>

        <div class="container">
            <h1>Detalhes do processo</h1>
            <div>
                <a href="/processos" class="back-btn">Voltar</a>
            </div>
            <form id="processo-form" @submit="salvarProcesso">
                <div class="input-container">
                    <label for="data">Número</label>
                    <input type="number" id="numero" name="numero" v-model="numero" disabled>       
                </div>

                <div class="input-container">
                    <label for="data">Data</label>
                    <input type="datetime-local" id="data" name="data" v-model="data" placeholder="Seleciona uma data">       
                </div>
                <div class="input-container">
                    <label for="tipo">Tipo</label>
                    <select name="tipo" id="tipo" v-model="tipo">
                        <option value="">Selecione o tipo</option>
                        <option value="judicial">Judicial</option>
                        <option value="extrajudicial">Extra judicial</option>
                    </select>
                </div>

                <PartesForm
                    metodo="editar"
                    :processoId="this.numero"
                    :partesLista="this.partes"
                />

                <PartesList
                    metodo="editar"
                    :partesLista="this.partes" 
                />

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
                
                <div class="history">
                    <router-link class="link-history" :to="{name: 'processo-historico'}">Histórico</router-link>
                </div>

                <div>
                    <router-view></router-view>
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

                
            </form>
        </div>

    
</template>

<script>
    import { ref } from "vue";
    import api from '../../services/api';
    import PartesList from "../partes/PartesList.vue";
    import PartesForm from "../partes/PartesForm.vue";
    import { createToaster } from "@meforma/vue-toaster";

    const toaster = createToaster({ });

    export default {
        name: "ProcessoDetalhe",
        components: {
            PartesList,
            PartesForm
        },
        data() {
            return {
                numero: null,
                data: null,
                tipo: "",
                obs: null,
                doc_nome: null,
                doc: ref(File | null),
                msg: null,
                parte: 0,
                partes: [],
                partesPut: [],
                errors: []
            }
        },
        methods: {
            async salvarProcesso(e){

                this.errors = [];

                if (!this.data) {
                    this.errors.push('A Data é obrigatória.');
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

                if (this.data && this.tipo.length && this.doc.length && this.partes.length ) {
                    this.errors.pop();
                    
                }

                e.preventDefault();

                if(!this.errors.length)
                {
                    await api.put('/processo/'+this.$route.params.id, {
                        data: this.data,
                        tipo: this.tipo,
                        observacoes: this.obs,
                        documentoNome: this.doc_nome,
                        documento: this.doc
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
                            toaster.show("Erro ao alterar!", {
                                type:"warning",
                                position: "top"
                            });
                            this.errors.push('Erro ao alterar.');
                        }
                    })
                    .catch((error) => {
                        toaster.show("Erro ao alterar!", {
                                type:"warning",
                                position: "top"
                            });

                            this.errors.push('Erro ao alterar.');
                        
                    });
                }

                
                if(!this.errors.length)
                {
                    setTimeout(()=>{
                        window.location.href = "/processos";
                    }, 2000)
                    
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
            async processo(id){
                await api.get('/processo/'+id)
                .then((response) => {
                    this.data = response.data.data;
                    this.tipo = response.data.tipo;
                    this.obs = response.data.observacoes;
                    this.doc_nome = response.data.documentoNome;
                    this.doc = response.data.documento;
                    this.partes = response.data.partes;
                    this.numero = response.data.id;
                })
                .catch((error) => {
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
    .history {
        margin-bottom: 30px
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
</style>