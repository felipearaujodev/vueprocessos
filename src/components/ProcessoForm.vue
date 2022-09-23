<template>
    <div>
        <div>

            <form id="processo-form" @submit="criarProcesso">
                <div class="input-container">
                    <label for="nome">Número <sup>*</sup></label>
                    <input type="number" id="numero" name="numero" v-model="numero" placeholder="Digite o número do processo">       
                </div>
                <div class="input-container">
                    <label for="data">Data <sup>*</sup></label>
                    <input type="date" id="data" name="data" v-model="data" placeholder="Seleciona uma data">       
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
                        v-on:change="fileUpload()" 
                        id="doc" 
                        name="doc">
                </div>

                <div>
                    <input type="submit" class="submit-btn" value="Criar Processo">
                </div>
            </form>
        </div>
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
                doc: ref(null),
                msg: null
            }
        },
        methods: {
            async criarProcesso(e){
                e.preventDefault();
               

                await api.post('/processo', {
                    numero: this.numero.toString(),
                    data: this.data,
                    tipo: this.tipo,
                    obs: this.obs,
                    documento: this.doc,
                    partes: []
                })
                .then(function (response) {
                    console.log(response)
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
                    }
                })
                .catch(function (error) {
                    toaster.show("Erro ao cadastrar!", {
                            type:"error",
                            position: "top"
                        });
                    
                });

                this.numero = "";
                this.data = null;
                this.tipo = "";
                this.obs = null;
                this.numero = 0;
                
            },
            async fileUpload(){
                console.log("selected file"+ doc.value)
                this.doc = doc.value
            }
        },
        mounted() {
            
        }
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