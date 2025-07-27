<template>
  <div class="relative">
    <!-- Floating Button -->
    <button 
      :class="[
        'w-20 h-20 rounded-full border-0 p-0 overflow-hidden cursor-pointer transition-all duration-200 ease-in-out shadow-lg bg-transparent hover:scale-105 hover:shadow-xl active:scale-95',
        'fixed z-50',
        positionClasses
      ]"
      @click="toggleChat"
      type="button"
    >
      <img src="/src/assets/chat.png" alt="Chat button" class="w-full h-full object-cover block">
    </button>

    <!-- Modal Overlay with Glassmorphism -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/20"
      @click="closeChat"
    >
      <!-- Chat Container -->
      <div 
        class="w-full max-w-4xl h-[80vh] bg-black/50 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        @click.stop
      >
        <!-- Chat Header -->
        <div class="flex items-center justify-between p-6 bg-white/5 border-b border-white/10">
          <div class="flex items-center space-x-4">
            <!-- AI Avatar -->
            <div class="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-white font-semibold text-lg">AI Assistant</h3>
              <p class="text-white/70 text-sm">Online • Ready to help</p>
            </div>
          </div>
          
          <!-- Close Button -->
          <button 
            @click="closeChat"
            class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Chat Messages Area -->
        <div class="flex-1 p-6 overflow-y-auto h-[calc(80vh-180px)]">
          <div class="space-y-6">
            <!-- AI Welcome Message -->
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div class="bg-white/40 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 max-w-md">
                <p class="text-white text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, voluptate.
                </p>
                <span class="text-white/50 text-xs mt-2 block">Ahora</span>
              </div>
            </div>

            <!-- Sample User Message -->
            <div class="flex items-start space-x-3 justify-end">
              <div class="bg-blue-600 rounded-2xl rounded-tr-sm p-4 max-w-md">
                <p class="text-white text-sm leading-relaxed">
                  Hola, ¿cómo puedo ayudarte?
                </p>
                <span class="text-white/70 text-xs mt-2 block text-right">hace 2 min</span>
              </div>
              <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>

            <!-- AI Response -->
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div class="bg-white/40 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 max-w-md">
                <p class="text-white text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, voluptate.
                </p>
                <span class="text-white/50 text-xs mt-2 block">hace 1 min</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input Area -->
        <div class="p-6 bg-white/5 border-t border-white/10">
          <div class="flex items-center space-x-4">
            <!-- Attachment Button -->
            <button class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200">
              <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
            </button>
            
            <!-- Input Field -->
            <div class="flex-1 relative">
              <input 
                type="text" 
                placeholder="Escribe un mensaje..."
                class="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200"
                v-model="messageInput"
                @keyup.enter="sendMessage"
              >
            </div>
            
            <!-- Send Button -->
            <button 
              @click="sendMessage"
              class="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
          
          <!-- Quick Actions -->
          <div class="flex items-center space-x-2 mt-4">
            <span class="text-white/50 text-xs">Quick actions:</span>
            <button class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/70 text-xs transition-colors duration-200">
              💡 Get ideas
            </button>
            <button class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/70 text-xs transition-colors duration-200">
              🔧 Debug code
            </button>
            <button class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/70 text-xs transition-colors duration-200">
              📚 Learn more
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: 'Hello from component'
    },
    position: {
      type: String,
      default: 'bottom-right',
      validator: function (value) {
        return ['top-right', 'top-left', 'bottom-left', 'bottom-right'].includes(value)
      }
    }
  },
  data() {
    return {
      isOpen: false,
      messageInput: ''
    }
  },
  computed: {
    positionClasses() {
      const positions = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4'
      }
      return positions[this.position] || positions['bottom-right']
    }
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen
      console.log('Chat toggled:', this.isOpen)
    },
    closeChat() {
      this.isOpen = false
    },
    sendMessage() {
      if (this.messageInput.trim()) {
        console.log('Sending message:', this.messageInput)
        // Here you would integrate with your AI service
        this.messageInput = ''
      }
    }
  }
}
</script>
