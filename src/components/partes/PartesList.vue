<template>
    <div v-if="partesLista.length" class="container">
        <div>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Sigiloso</th>
                        <th scope="col">CPF</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Sexo</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="parteProcesso, index in partesLista" :key="partesLista">
                        <td v-if="parteProcesso.sigiloso">Sim</td>
                        <td v-else>Não</td>
                        <td>{{parteProcesso.cpf}}</td>
                        <td>{{parteProcesso.nome}}</td>
                        <td v-if="parteProcesso.sexo == 'masculino'">Masculino</td>
                        <td v-else-if="parteProcesso.sexo == 'feminino'">Feminino</td>
                        <td v-else="parteProcesso.sexo == 'ignorado'">Não informado</td>
                        <td v-if="metodo == 'incluir'"><a v-on:click="removerParteHtml(index)" href="javascript:void(0)">Remover</a></td>
                        <td v-else-if="metodo == 'editar'"><a v-on:click="removerParteApi(parteProcesso.id, index)" href="javascript:void(0)">Excluir</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import api from '../../services/api.js'
    import { createToaster } from "@meforma/vue-toaster";

    const toaster = createToaster({ });

    export default {
        name: "PartesList",
        props: {
            partesLista: Array,
            metodo: String
        },
        data(){
            return {
            }
        },
        methods:{
            removerParteHtml(index) {
                this.partesLista.splice(index, 1);                
            },
            async removerParteApi(historicoId, index) {
                await api.delete('/processoPartes/'+historicoId)
                .then((response) => {
                    toaster.show("Excluído com sucesso", {
                        type:"info",
                        position: "top"
                    }); 

                    this.partesLista.splice(index, 1); 
                })
                .catch((error) => {
                    let mensagem = "Tempo excedido, tente novamente mais tarde";
                    if(error.hasOwnProperty("response"))
                    {
                        mensagem = error.response.status + ' - ' + error.response.data;
                    }

                    toaster.show(mensagem, {
                        type:"warning",
                        position: "top"
                    });            
                });             
            }
        },
        mounted(){
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
        margin: 0px
    }

    table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }


</style>