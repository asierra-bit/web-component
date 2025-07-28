import OpenAI from 'openai';

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para desarrollo, en producción usar un backend
});

export class ChatService {
  constructor() {
    this.messages = [
      {
        role: 'system',
        content: 'Eres un asistente de IA útil y amigable especializado en una plataforma escolar llamada Academic. Responde de manera concisa y práctica.'
      }
    ];
  }

  async sendMessage(userMessage) {
    try {
      // Agregar mensaje del usuario al historial
      this.messages.push({
        role: 'user',
        content: userMessage
      });

      // Llamar a la API de OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: this.messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0].message.content;

      // Agregar respuesta de la IA al historial
      this.messages.push({
        role: 'assistant',
        content: aiResponse
      });

      return {
        success: true,
        message: aiResponse,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      
      // Respuesta de fallback si hay error
      return {
        success: false,
        message: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, verifica tu API key de OpenAI.',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  clearHistory() {
    this.messages = [
      {
        role: 'system',
        content: 'Eres un asistente de IA útil y amigable especializado en desarrollo web. Responde de manera concisa y práctica.'
      }
    ];
  }
}

export default new ChatService();