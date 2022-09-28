<template>

        <div class="container">
            <h1>Cadastro</h1>
            <div>
                <a href="/processos" class="back-btn">Voltar</a>
            </div>
            <form id="processo-form" @submit="criarProcesso">
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
                    metodo="incluir"
                    :partesLista="this.partes"
                />

                <PartesList 
                    metodo="incluir"
                    :partesLista="this.partes" 
                />
                <div class="input-container">
                    <label for="obs">Observações</label> 
                    <textarea id="obs" name="obs" v-model="obs" placeholder="Observações" rows="5" cols="50">At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.</textarea>    
                </div>
                <div class="input-container">
                    <label for="doc">Selecione o documento:</label>
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
                    <input id="criar-processo" type="submit" class="submit-btn" value="Criar Processo">
                </div>
            </form>
        </div>

    
</template>

<script>
    import { ref } from "vue";
    import PartesList from "../partes/PartesList.vue";
    import PartesForm from "../partes/PartesForm.vue";
    import api from '../../services/api';
    import { createToaster } from "@meforma/vue-toaster";

    const toaster = createToaster({ });

    export default {
        name: "ProcessoForm",
        components: {
            PartesList,
            PartesForm
        },
        data() {
            return {
                data: null,
                tipo: "",
                obs: null,
                doc: ref(File | null),
                doc_nome: "",
                msg: null,
                parte: 0,
                partes: [],
                errors: [],
            }
        },
        methods: {
            async criarProcesso(e){

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
                    document.getElementById("criar-processo").disabled = true;
                    await api.post('/processo', {
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
                                type:"warning",
                                position: "top"
                            });
                            this.errors.push('Erro ao cadastrar.');
                            document.getElementById("criar-processo").disabled = false;
                        }
                    })
                    .catch((error) => {
                        toaster.show("Erro ao cadastrar!", {
                            type:"warning",
                            position: "top"
                        });

                        this.errors.push('Erro ao cadastrar.');

                        document.getElementById("criar-processo").disabled = false;
                        
                    });
                }

                
                if(!this.errors.length)
                {
                    document.getElementById("criar-processo").disabled = true;
                    setTimeout(()=>{
                        window.location.href = "/processos";
                    },2000);
                    
                }
                
            },
            async fileUpload(e){
                console.log(this.partes)
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