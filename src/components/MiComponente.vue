<template>
  <!-- Botón flotante -->
  <div 
    :class="[
      'fixed top-8 right-8 z-50 transition-all duration-500 ease-out',
      { 'expanded': isExpanded, 'focused': isFocused }
    ]"
    @mouseenter="handleHover"
    @mouseleave="handleLeave"
  >
    <!-- Campo de búsqueda expandible -->
    <div :class="[
      'flex items-center rounded-full overflow-hidden transition-all duration-500 ease-out backdrop-blur-sm',
      'w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30',
      isExpanded ? 'w-80 bg-white/95 border-2 border-blue-500 shadow-xl shadow-blue-500/20' : '',
      isFocused ? 'bg-white border-2 border-blue-500 shadow-2xl shadow-blue-500/30' : ''
    ]">
      <input 
        ref="searchInput"
        v-model="searchQuery"
        type="text" 
        placeholder="Buscar..."
        :class="[
          'flex-1 border-none outline-none px-5 text-base bg-transparent transition-all duration-500 ease-out',
          isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
        ]"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleSearch"
      />
      <button 
        :class="[
          'w-14 h-14 border-none rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ease-out flex-shrink-0 relative',
          'bg-transparent hover:scale-110 hover:bg-white/10',
          isExpanded ? 'bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 m-1 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40 hover:from-blue-600 hover:to-purple-700' : ''
        ]"
        @click="toggleSearch"
      >
        <svg class="w-5 h-5 text-white stroke-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>
    </div>
    
    <!-- Vista expandida cuando está en focus -->
    <div v-if="isFocused" class="fixed inset-0 w-screen h-screen glass-backdrop flex items-center justify-center z-40 animate-fade-in" @click="closeModal">
      <div class="glass-modal rounded-2xl p-8 max-w-lg w-11/12 relative animate-slide-up" @click.stop>
        <!-- Header minimalista -->
        <div class="flex items-center justify-between mb-6">
          <div class="w-6 h-6 rounded-full bg-white/20"></div>
          <button 
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200" 
            @click="closeModal"
            aria-label="Cerrar modal"
          >
            <span class="text-white/70 text-sm font-light">esc</span>
          </button>
        </div>
        
        <!-- Campo de búsqueda principal -->
        <div class="mb-8">
          <div class="relative">
            <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              ref="modalSearchInput"
              v-model="searchQuery"
              type="text" 
              placeholder="Search documentation"
              class="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 outline-none transition-all duration-300 focus:bg-white/15 focus:border-white/30"
              @keyup.enter="handleSearch"
              @input="handleInputChange"
            />
          </div>
        </div>
        
        <!-- Área de resultados minimalista -->
        <div class="min-h-40 mb-6">
          <div v-if="searchQuery" class="space-y-2">
            <div class="text-xs text-white/50 mb-3">Recent searches</div>
            <div v-for="result in searchResults.slice(0, 3)" :key="result.id" class="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
              <div class="flex items-center space-x-3">
                <div class="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                  <svg class="w-3 h-3 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-white/80">{{ result.title }}</p>
                  <p class="text-xs text-white/40">{{ result.type }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <div class="text-white/30 text-sm">No recent searches</div>
          </div>
        </div>
        
        <!-- Footer minimalista -->
        <div class="flex items-center justify-between text-xs text-white/40">
          <div class="flex items-center space-x-4">
            <span>Search by</span>
            <div class="flex items-center space-x-1">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
              </svg>
              <span>algolia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, watch } from 'vue'

defineProps({
  mensaje: {
    type: String,
    default: 'Este es un componente Vue'
  }
})

// Estados reactivos
const isExpanded = ref(false)
const isFocused = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('relevancia')
const searchInput = ref(null)
const modalSearchInput = ref(null)

// Datos simulados para resultados
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  
  // Simulación de resultados basados en la búsqueda
  const mockResults = [
    { id: 1, title: `Documento sobre ${searchQuery.value}`, type: 'documento', date: new Date() },
    { id: 2, title: `Imagen relacionada con ${searchQuery.value}`, type: 'imagen', date: new Date() },
    { id: 3, title: `Video de ${searchQuery.value}`, type: 'video', date: new Date() }
  ]
  
  // Filtrar por categoría si está seleccionada
  let filtered = mockResults
  if (selectedCategory.value) {
    filtered = mockResults.filter(result => {
      const categoryMap = {
        'documentos': 'documento',
        'imagenes': 'imagen', 
        'videos': 'video',
        'archivos': 'archivo'
      }
      return result.type === categoryMap[selectedCategory.value]
    })
  }
  
  return filtered
})

// Funciones de manejo de eventos
const handleHover = () => {
  isExpanded.value = true
}

const handleLeave = () => {
  if (!isFocused.value) {
    isExpanded.value = false
  }
}

const handleFocus = async () => {
  isFocused.value = true
  isExpanded.value = true
  
  // Enfocar el input del modal después de que se renderice
  await nextTick()
  modalSearchInput.value?.focus()
}

const handleBlur = () => {
  // Removido el setTimeout para evitar cierre accidental
  // El modal ahora solo se cierra explícitamente
}

const closeModal = () => {
  isFocused.value = false
  isExpanded.value = false
}

const toggleSearch = async () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Buscando:', {
      query: searchQuery.value,
      category: selectedCategory.value,
      sortBy: sortBy.value,
      results: searchResults.value.length
    })
    
    // Aquí puedes agregar la lógica de búsqueda real
    // Por ejemplo, llamar a una API o filtrar datos
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  sortBy.value = 'relevancia'
  modalSearchInput.value?.focus()
}

const handleInputChange = () => {
  // Función para manejar cambios en tiempo real en el input
  // Aquí podrías implementar búsqueda en tiempo real
}

// Watcher para enfocar automáticamente el input del modal
watch(isFocused, async (newValue) => {
  if (newValue) {
    await nextTick()
    modalSearchInput.value?.focus()
  }
})

// Manejo de teclas para mejorar la accesibilidad
const handleKeydown = (event) => {
  if (event.key === 'Escape' && isFocused.value) {
    closeModal()
  }
}

// Agregar listener para la tecla Escape
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<style scoped>
/* Animaciones personalizadas que no están disponibles en Tailwind */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    transform: scale(1);
    backdrop-filter: blur(8px);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulse-search {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-slide-up {
  animation: slide-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Efecto de sombra personalizada para el modal */
.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* Animación de pulso para el botón de búsqueda cuando está activo */
.search-button-active {
  animation: pulse-search 2s infinite;
}

/* Mejoras para el scroll en el área de resultados */
.results-area {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.results-area::-webkit-scrollbar {
  width: 6px;
}

.results-area::-webkit-scrollbar-track {
  background: transparent;
}

.results-area::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.results-area::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}

/* Efecto de cristal para el backdrop y modal */
.glass-backdrop {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.glass-modal {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4), 
              0 0 0 1px rgba(255, 255, 255, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Animación suave para los elementos que aparecen */
.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design mejorado */
@media (max-width: 768px) {
  .top-8 {
    top: 0.5rem;
  }
  
  .right-8 {
    right: 0.5rem;
  }
  
  .expanded .w-80 {
    width: calc(100vw - 2rem);
  }
  
  /* Ajustes para el modal en móviles */
  .max-w-2xl {
    max-width: calc(100vw - 1rem);
  }
  
  .p-10 {
    padding: 1.5rem;
  }
  
  .text-3xl {
    font-size: 1.875rem;
  }
}

@media (max-width: 480px) {
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .flex.gap-3 {
    flex-direction: column;
  }
  
  .flex-1 {
    flex: none;
  }
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-slide-up,
  .fade-in-up {
    animation: none;
  }
  
  .transition-all {
    transition: none;
  }
}

/* Modo oscuro (preparado para futuras implementaciones) */
@media (prefers-color-scheme: dark) {
  .bg-white {
    background-color: #1f2937;
    color: #f9fafb;
  }
  
  .text-gray-800 {
    color: #f9fafb;
  }
  
  .text-gray-500 {
    color: #9ca3af;
  }
  
  .border-gray-200 {
    border-color: #374151;
  }
  
  .bg-gray-50 {
    background-color: #374151;
  }
}
</style>
