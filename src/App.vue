<script setup>
import NexusChat from './components/NexusChat.vue'
</script>

<template>
  <div class="min-h-screen bg-red-500 p-8"> 
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      Floating Buttons in Different Positions
    </h1>
    
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <p class="text-lg text-gray-600 mb-4">
        This is the main content of the page. The floating buttons will appear in the corners of the screen.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="font-semibold text-blue-800 mb-2">Available positions:</h3>
          <ul class="text-blue-700 space-y-1">
            <li>• top-right</li>
            <li>• top-left</li>
            <li>• bottom-left</li>
            <li>• bottom-right (default)</li>
          </ul>
        </div>
        
        <div class="bg-green-50 p-4 rounded-lg">
          <h3 class="font-semibold text-green-800 mb-2">Features:</h3>
          <ul class="text-green-700 space-y-1">
            <li>• Fixed position on screen</li>
            <li>• Hover and click effects</li>
            <li>• Fully responsive</li>
            <li>• Using Tailwind CSS</li>
          </ul>
        </div>
      </div>
      
      <p class="text-gray-600">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed hic impedit fuga est at voluptates temporibus omnis deserunt quaerat ut quos delectus, numquam, sunt deleniti expedita officiis cupiditate? Facilis, itaque?
      </p>
    </div>
    
    <!-- Components with different positions -->
    <NexusChat message="Top Right" position="top-right" />
    <NexusChat message="Top Left" position="top-left" />
    <NexusChat message="Bottom Left" position="bottom-left" />
    <NexusChat message="Bottom Right" position="bottom-right" />
  </div>
</template>

<style>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
