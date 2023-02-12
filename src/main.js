import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useLocalStorageService } from '@/services/useLocalStorageService'

import App from './App.vue'
import router from './router'
const pinia = createPinia()

import './assets/main.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const localStorage = useLocalStorageService()

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: localStorage.get('theme_mode', 'light')
    },
    icons: {
        aliases,
        sets: {
            mdi,
        }
    },
})

const app = createApp(App)

app
    .use(pinia)
    .use(router)
    .use(vuetify)

app.mount('#app')
