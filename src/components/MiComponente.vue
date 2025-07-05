<template>
  <div class="mi-componente">
    <h2>Hola desde Vue</h2>
    <p>{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mensaje = ref('Este es un Web Component con Vue')
</script>

<style scoped>
.mi-componente {
  border: 1px solid #ccc;
  padding: 1rem;
  font-family: sans-serif;
}
</style>
