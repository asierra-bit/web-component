import { defineCustomElement } from 'vue'
import MiComponente from './components/MiComponente.vue' // Asegúrate de que el archivo exista

const MiComponenteCE = defineCustomElement(MiComponente)
customElements.define('mi-componente', MiComponenteCE)
