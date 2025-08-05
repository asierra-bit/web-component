// Configuración de la API de AWS
// En desarrollo usa el proxy, en producción usa la URL directa
const API_URL = import.meta.env.DEV 
  ? '/api' 
  : 'https://rbpiwu0vm6.execute-api.us-east-1.amazonaws.com/documentation/v1';

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

      // Construir el prompt con el historial de mensajes
      const fullPrompt = this.messages.map(msg => {
        if (msg.role === 'system') return `Sistema: ${msg.content}`;
        if (msg.role === 'user') return `Usuario: ${msg.content}`;
        if (msg.role === 'assistant') return `Asistente: ${msg.content}`;
        return msg.content;
      }).join('\n\n');

      // Llamar a la nueva API de AWS
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extraer la respuesta de la IA (ajustar según la estructura de respuesta de tu API)
      const aiResponse = data.response || data.message || data.content || 'No se recibió respuesta válida';

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
      console.error('Error calling AWS API:', error);
      
      // Respuesta de fallback si hay error
      return {
        success: false,
        message: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, verifica la conexión con el servidor.',
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