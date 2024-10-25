<template>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import { get } from 'http';
import { initDatabaseFromJson } from './services/globalServ'
import { getProjectById } from './services/projectsServ'

//La liste de tous les composants (elle sera mise à jour au fur et à mesure des actions de l'utilisateur)
// const allComponents = ref<Component[]>([]);
// const tagList = ref<String[]>([])

let l1 = getProjectById(1)


</script>