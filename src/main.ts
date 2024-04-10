import { createPinia } from 'pinia'
import App from './App.vue'
import './index.scss'

import { createApp } from 'vue'
import router from './router'
import { createHead } from '@unhead/vue'
// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
// export function createApp() {
//   const app = createSSRApp(App)
// 	app.use(createPinia())
// 	app.use(router)
// 	app.use(createMetaManager());
// 	// app.use(glsl);
//   return { app }
// }
//@ts-ignore
import glsl from 'vue-glsl'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(glsl);
const head = createHead()
app.use(head)

app.mount('#app');