<template>
    <div class="container">
        <div>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Número</th>
                        <th scope="col">Data</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Observações</th>
                        <th scope="col">Documento</th>
                        <th scope="col">Restaurar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="processoHistorico in data">
                        <td>{{processoHistorico.id}}</td>
                        <td>{{processoHistorico.processoId}}</td>
                        <td>{{formatarData(processoHistorico.dataLog)}}</td>
                        <td>{{processoHistorico.tipo}}</td>
                        <td>{{processoHistorico.observacoes}}</td>
                        <td><a v-bind:download="processoHistorico.documentoNome" v-bind:href="processoHistorico.documento" target="_blank">{{processoHistorico.documentoNome}}</a></td>
                        <td><a href="javascript:void(0)" v-on:click="restaurar(processoHistorico.id)">Restaurar</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import api from '../../services/api';
    import moment from 'moment';
    import { createToaster } from "@meforma/vue-toaster";

    const toaster = createToaster({ });

    export default {
        name: "ProcessosList",
        data() {
            return {
                data: [],
                errors: []
            }
        },
        methods: {
            async processos() {

                await api.get('/processoHistorico/'+this.$route.params.id)
                .then((response) => {
                    this.data = response.data;
                    this.data.sort((a, b) => (a.id > b.id) ? -1 : 1)                    
                })
                .catch(function (error) {

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
            },
            async restaurar(historicoId) {

                await api.post('/processoHistorico/'+ historicoId +'/restaurar', {

                })
                .then((response) => {
                    if(response.status >= 200 && response.status <= 299)
                    {
                        toaster.show("Histórico restaurado com sucesso!", {
                            type:"info",
                            position: "top"
                        });

                        setTimeout(()=>{
                            window.location.href = "/processos";
                        }, 2000)
                    }
                    else
                    {
                        toaster.show("Erro ao restaurar histórico!", {
                            type:"error",
                            position: "top"
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    toaster.show("Erro ao restaurar histórico!", {
                        type:"error",
                        position: "top"
                    });                    
                });
            },
            formatarData(valor) {
                return moment(valor).format('DD/MM/YYYY HH:mm ')
            }
        },
        mounted() {
            this.processos()
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
        margin-top: 20px;
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