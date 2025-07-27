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
            <div class="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-white font-semibold text-lg">AI Assistant</h3>
              <p class="text-white/70 text-sm">{{ isTyping ? 'Escribiendo...' : 'Online • Ready to help' }}</p>
            </div>
          </div>
          
          <!-- Clear Chat & Close Buttons -->
          <div class="flex items-center space-x-2">
            <button 
              @click="clearChat"
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
              title="Limpiar chat"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
            <button 
              @click="closeChat"
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Chat Messages Area -->
        <div ref="messagesContainer" class="flex-1 p-6 overflow-y-auto h-[calc(80vh-180px)]">
          <div class="space-y-6">
            <!-- Welcome Message -->
            <div v-if="chatMessages.length === 0" class="flex items-start space-x-3">
              <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div class="bg-white/40 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 max-w-md">
                <p class="text-white text-sm leading-relaxed">
                  👋 ¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?
                </p>
                <span class="text-white/50 text-xs mt-2 block">Ahora</span>
              </div>
            </div>

            <!-- Chat Messages -->
            <div v-for="(msg, index) in chatMessages" :key="index">
              <!-- AI Message -->
              <div v-if="msg.type === 'ai'" class="flex items-start space-x-3">
                <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div class="bg-white/40 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 max-w-md">
                  <p class="text-white text-sm leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
                  <span class="text-white/50 text-xs mt-2 block">{{ formatTime(msg.timestamp) }}</span>
                </div>
              </div>

              <!-- User Message -->
              <div v-else class="flex items-start space-x-3 justify-end">
                <div class="bg-blue-600 rounded-2xl rounded-tr-sm p-4 max-w-md">
                  <p class="text-white text-sm leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
                  <span class="text-white/70 text-xs mt-2 block text-right">{{ formatTime(msg.timestamp) }}</span>
                </div>
                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Typing Indicator -->
            <div v-if="isTyping" class="flex items-start space-x-3">
              <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-white/60 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-white/60 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
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
                ref="messageInput"
                type="text" 
                placeholder="Escribe tu mensaje..."
                class="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200"
                v-model="messageInput"
                @keyup.enter="sendMessage"
                :disabled="isTyping"
              >
            </div>
            
            <!-- Send Button -->
            <button 
              @click="sendMessage"
              :disabled="isTyping || !messageInput.trim()"
              class="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg v-if="!isTyping" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </button>
          </div>
          
          <!-- Quick Actions -->
          <div class="flex items-center space-x-2 mt-4">
            <span class="text-white/50 text-xs">Acciones rápidas:</span>
            <button @click="sendQuickMessage('💡 Dame ideas para mi proyecto web')" class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/70 text-xs transition-colors duration-200">
              💡 Ideas
            </button>
            <button @click="sendQuickMessage('🔧 Ayúdame a debuggear mi código')" class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/70 text-xs transition-colors duration-200">
              🔧 Debug
            </button>
            <button @click="sendQuickMessage('📚 Explícame conceptos de desarrollo web')" class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/70 text-xs transition-colors duration-200">
              📚 Aprender
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chatService from '../services/openai.js'

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
      messageInput: '',
      chatMessages: [],
      isTyping: false
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
      if (this.isOpen) {
        this.$nextTick(() => {
          this.$refs.messageInput?.focus()
        })
      }
    },
    closeChat() {
      this.isOpen = false
    },
    clearChat() {
      this.chatMessages = []
      chatService.clearHistory()
    },
    async sendMessage() {
      if (!this.messageInput.trim() || this.isTyping) return

      const userMessage = this.messageInput.trim()
      this.messageInput = ''

      // Agregar mensaje del usuario
      this.chatMessages.push({
        type: 'user',
        content: userMessage,
        timestamp: new Date()
      })

      this.scrollToBottom()
      this.isTyping = true

      try {
        // Enviar mensaje a OpenAI
        const response = await chatService.sendMessage(userMessage)
        
        // Agregar respuesta de la IA
        this.chatMessages.push({
          type: 'ai',
          content: response.message,
          timestamp: new Date(),
          success: response.success
        })

        if (!response.success) {
          console.error('Error from OpenAI:', response.error)
        }

      } catch (error) {
        console.error('Error sending message:', error)
        this.chatMessages.push({
          type: 'ai',
          content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, verifica tu configuración de OpenAI.',
          timestamp: new Date(),
          success: false
        })
      } finally {
        this.isTyping = false
        this.scrollToBottom()
      }
    },
    sendQuickMessage(message) {
      this.messageInput = message
      this.sendMessage()
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },
    formatTime(timestamp) {
      const now = new Date()
      const messageTime = new Date(timestamp)
      const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60))
      
      if (diffInMinutes < 1) return 'Ahora'
      if (diffInMinutes < 60) return `${diffInMinutes} min`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h`
      return messageTime.toLocaleDateString()
    }
  }
}
</script>
