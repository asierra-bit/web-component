<template>
  <div class="max-w-md mx-auto bg-blue-50 rounded-xl shadow-lg overflow-hidden border border-gray-200 p-6 space-y-4">
    <h2 class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg text-xl font-bold text-center shadow-md">Hola desde Vue</h2>
    <p class="text-gray-700 font-medium text-center bg-gray-50 p-3 rounded-md">{{ mensaje }}</p>
    <div class="flex space-x-2">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">Botón 1</button>
      <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">Botón 2</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mensaje: {
    type: String,
    default: 'Este es un componente Vue'
  }
})
</script>

<style>
/* Los estilos se incluyen automáticamente en el web component */
</style>
