import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
(window as any).CESIUM_BASE_URL = './cesium/';

createApp(App).mount('#app')
