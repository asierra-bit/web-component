import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import MiComponente from './components/MiComponente.vue'

// Crear la aplicación Vue
const app = createApp(App)
app.mount('#app')

// También registrar como web component para uso externo
import { defineCustomElement } from 'vue'
import styleCSS from './style.css?inline'

// Crear web component con estilos incluidos
const MiComponenteCE = defineCustomElement({
  ...MiComponente,
  styles: [styleCSS]
})
customElements.define('mi-componente', MiComponenteCE)
