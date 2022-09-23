<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th scope="col">Número</th>
                    <th scope="col">Data</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="processo in itens" :key="processo">
                    <td>{{processo.name}}</td>
                    <td>{{processo.height}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import { defineComponent } from 'vue';
    import api from '../services/api';

    export default defineComponent({
        setup() {
            var itens = [];

            api.get('/processo')
                .then(function (response) {
                    console.log(response.data)
                    console.log(itens); 
                    this.itens = response.data;
                    
                    
                })
                .catch(function (error) {
                                    
                });

                

            return {
                itens
            };
        }
        /*name: "ProcessosList",
        data() {
            return {
                data: null
            }
        },
        methods: {
            async processos() {
                await api.get('/processo')
                .then(function (response) {
                    console.log(response)
                    this.data = response.data;

                    
                })
                .catch(function (error) {
                                        
                });
            }
        },
        mounted() {
            this.processos()
        }*/
    })
</script>

<style scoped>
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

    tr:nth-child(even) {
    background-color: #dddddd;
    }
</style>