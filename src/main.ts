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
