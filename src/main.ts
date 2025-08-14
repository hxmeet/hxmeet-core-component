import { createApp, defineComponent } from 'vue'
import App from './App.vue'
import ui from '@nuxt/ui/vue-plugin'
import {createRouter, createWebHistory} from "vue-router";
import './assets/main.css'

const app = createApp(App)

const router = createRouter({
  routes: [
    { path: '/', component: defineComponent({}) },
  ],
  history: createWebHistory()
})

app.use(router)
app.use(ui)

app.mount('#app')
