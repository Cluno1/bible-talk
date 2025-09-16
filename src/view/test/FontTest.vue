<template>
    <h1>test</h1>

</template>

<script setup lang="ts">


    const obj={
        name:'zld',
        start(){
            console.log(this.name,'now')
        }
    }

    setTimeout(obj.start, 1000);
</script>