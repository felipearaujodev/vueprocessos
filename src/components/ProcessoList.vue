<template>
    <div class="container">
        <div>
            <a href="/processo-cadastro" class="new-btn">Novo processo</a>
        </div>
        <p v-if="errors.length">
            <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
            <ul>
            <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        <div>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Número</th>
                        <th scope="col">Data</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Detalhes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="processo in data" :key="processo">
                        <td>{{processo.id}}</td>
                        <td>{{currentDateTime(processo.data)}}</td>
                        <td v-if="processo.tipo == 'extrajudicial'">Extra Judicial</td>
                        <td v-else>Judicial</td>
                        <td><router-link :to="{name: 'processo-detalhes', params: {id: processo.id}}">Detalhes</router-link></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import api from '../services/api';
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

                await api.get('/processo')
                .then((response) => {
                    this.data = response.data;
                    this.data.sort((a, b) => (a.data > b.data) ? -1 : (a.data === b.data) ? ((a.id != b.id) ? -1 : 1) : 1)                    
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
            currentDateTime(valor) {
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
        margin: 10px
    }


    
</style>