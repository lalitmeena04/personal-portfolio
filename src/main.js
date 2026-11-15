import { createApp } from 'vue'
import '@fontsource/chakra-petch/latin-500.css'
import '@fontsource/chakra-petch/latin-700.css'
import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/press-start-2p/latin-400.css'
import './styles/base.css'
import App from './App.vue'
import { reveal } from './directives/reveal'

createApp(App).directive('reveal', reveal).mount('#app')
