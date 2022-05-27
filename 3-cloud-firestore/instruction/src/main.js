import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'
import Home from './pages/Home.vue';
import 'open-props/style';
import 'open-props/normalize';
import 'open-props/colors-hsl';
import 'open-props/sizes';

const routes = [
  { path: '/', component: Home }
]

createApp(App)
  .use(createRouter({ 
    history: createWebHistory(),
    routes 
  }))
  .mount('#app')
