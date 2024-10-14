// src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css'; // Подключаем Tailwind CSS
import { createPinia } from 'pinia'; // Импортируем Pinia
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App);

app.use(createPinia()); // Подключаем Pinia
app.mount('#app');
