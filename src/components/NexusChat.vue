<template>
  <div class="relative">
    <!-- Floating Button -->
    <button :class="[
      'w-16 h-16 rounded-full p-0 overflow-hidden cursor-pointer transition-all duration-200 ease-in-out shadow-lg bg-white/60 backdrop-blur-sm hover:scale-105 hover:shadow-xl active:scale-95 border-2 border-slate-600',
      'fixed z-50 flex justify-center items-center',
      positionClasses
    ]" @click="toggleChat" type="button">
      <img src="/src/assets/nexus-full.png" alt="Chat button" class="w-12 h-12 object-contain block">
    </button>

    <!-- Modal Overlay with Glassmorphism -->
    <div v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/30"
      @click="closeChat">
      <!-- Chat Container -->
      <div
        class="w-full max-w-4xl h-[80vh] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md border border-slate-600/30 rounded-3xl shadow-2xl overflow-hidden"
        @click.stop>
        <!-- Chat Header -->
        <div class="flex items-center justify-between p-6 bg-slate-800/50 border-b border-slate-600/30">
          <div class="flex items-center space-x-4">

            <button :class="[
              'w-16 h-16 rounded-full p-0 overflow-hidden cursor-pointer transition-all duration-200 ease-in-out shadow-lg bg-white/80 backdrop-blur-sm hover:scale-105 hover:shadow-xl active:scale-95 border-2 border-slate-600',
              ' flex justify-center items-center',
              positionClasses
            ]" type="button">
              <img src="/src/assets/nexus-full.png" alt="Chat button" class="w-10 h-10 object-contain block">
            </button>
            <div>
              <h3 class="text-slate-100 font-semibold text-lg">
                Nexus
              </h3>
              <p class="text-slate-300 text-sm flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                {{ isTyping ? 'Escribiendo...' : 'En linea y listo para ayudarte' }}
              </p>
            </div>
          </div>

          <!-- Clear Chat & Close Buttons -->
          <div class="flex items-center space-x-2">
            <button @click="clearChat"
              class="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center transition-colors duration-200"
              title="Limpiar chat">
              <svg class="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                </path>
              </svg>
            </button>
            <button @click="closeChat"
              class="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center transition-colors duration-200">
              <svg class="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Chat Messages Area -->
        <div ref="messagesContainer" class="flex-1 p-6 overflow-y-auto h-[calc(75vh-180px)]">
          <div class="space-y-6">
            <!-- Welcome Message -->
            <div v-if="chatMessages.length === 0" class="flex items-start space-x-3">
              <div
                class="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-slate-500 overflow-hidden">
                <img src="/src/assets/oli.png" alt="AI Avatar" class="w-full h-full object-cover">
              </div>
              <div
                class="bg-slate-700/60 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 max-w-md border border-slate-600/30">
                <p class="text-slate-100 text-sm leading-relaxed">
                  👋 ¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?
                </p>
                <span class="text-slate-300 text-xs mt-2 block">Ahora</span>
              </div>
            </div>

            <!-- Chat Messages -->
            <div v-for="(msg, index) in chatMessages" :key="index">
              <!-- AI Message -->
              <div v-if="msg.type === 'ai'" class="flex items-start space-x-3">
                <div
                  class="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-slate-500 overflow-hidden">
                  <img src="/src/assets/oli.png" alt="AI Avatar" class="w-full h-full object-cover">
                </div>
                <div
                  class="bg-slate-700/60 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 max-w-md border border-slate-600/30">
                  <p class="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
                  <span class="text-slate-300 text-xs mt-2 block">{{ formatTime(msg.timestamp) }}</span>
                </div>
              </div>

              <!-- User Message -->
              <div v-else class="flex items-start space-x-3 justify-end">
                <div
                  class="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl rounded-tr-sm p-4 max-w-md border border-slate-500/50">
                  <p class="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
                  <span class="text-slate-200 text-xs mt-2 block text-right">{{ formatTime(msg.timestamp) }}</span>
                </div>
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center flex-shrink-0 border border-slate-400">
                  <svg class="w-4 h-4 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Typing Indicator -->
            <div v-if="isTyping" class="flex items-start space-x-3">
              <div
                class="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-slate-500 overflow-hidden">
                <img src="/src/assets/oli.png" alt="AI Avatar" class="w-full h-full object-cover">
              </div>
              <div class="bg-slate-700/40 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 border border-slate-600/30">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input Area -->
        <div class="p-6 bg-slate-800/30 border-t border-slate-600/30">
          <div class="flex items-center space-x-4">


            <!-- Input Field -->
            <div class="flex-1 relative">
              <input ref="messageInput" type="text" placeholder="Escribe tu mensaje..."
                class="w-full bg-slate-700/40 backdrop-blur-sm border border-slate-600/40 rounded-2xl px-6 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 transition-all duration-200"
                v-model="messageInput" @keyup.enter="sendMessage" :disabled="isTyping">
            </div>

            <!-- Send Button -->
            <button @click="sendMessage" :disabled="isTyping || !messageInput.trim()"
              class="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl border border-slate-500">
              <svg v-if="!isTyping" class="w-5 h-5 text-slate-100" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <div v-else class="w-5 h-5 border-2 border-slate-200 border-t-transparent rounded-full animate-spin">
              </div>
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
