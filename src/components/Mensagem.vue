<template>
    <p>a</p>
</template>


<script>
    import { createToaster } from "@meforma/vue-toaster";

    const toaster = createToaster({ });

    toaster.show("Hey! I'm here", {
        type:"info",
        position: "top"
    });
    export default {
        name: "Mensagem",
        props: {
            mensagem: String
        }
    }



</script>


<style scoped>
    .message-container {
        color: rgb(72, 72, 248);
        background-color: rgb(146, 190, 255);
        border: 2px solid rgb(108, 165, 252);
        border-radius: 5px;
        padding: 10px;
        max-width: 400px;
        margin: 30px auto;
    }
</style>