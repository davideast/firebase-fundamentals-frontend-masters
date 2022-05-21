import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'
import Home from './pages/Home.vue';
import Reading101 from './pages/Reading101.vue';
import Querying101 from './pages/Querying101.vue';
import 'open-props/style';
import 'open-props/normalize';
import 'open-props/colors';
import 'open-props/colors-hsl';
import 'open-props/sizes';

const routes = [
  { path: '/', component: Home },
  { path: '/reading-101', component: Reading101 },
  { path: '/querying-101', component: Querying101 },
]

createApp(App)
  .use(createRouter({ 
    history: createWebHistory(),
    routes 
  }))
  .mount('#app')
