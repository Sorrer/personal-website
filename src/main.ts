import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './index.scss'

		//@ts-ignore
import glsl from 'vue-glsl';




const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(glsl);
app.mount('#app')


import { createSSRApp } from 'vue'

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createAppSSR() {
  const app = createSSRApp(App)
  return { app }
}