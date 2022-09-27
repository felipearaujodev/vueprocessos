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
                        <td><a v-on:click="removerParte(index)" href="javascript:void(0)">Excluir</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    

    export default {
        name: "PartesList",
        props: {
            partesLista: Array
        },
        data(){
            return {
            }
        },
        methods:{
            removerParte(index) {
                this.partesLista.splice(index, 1);                
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