import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Dashboard from './components/Dashboard.vue';
import Editor from './components/Editor.vue';
import 'open-props/style';
import 'open-props/normalize';
import 'open-props/colors';
import 'open-props/colors-hsl';
import 'open-props/sizes';

const routes = [
  { path: '/', component: Home },
  { path: '/dashboard/', component: Dashboard },
  { path: '/editor/:id', component: Editor }
]

createApp(App)
  .use(createRouter({ 
    history: createWebHistory(),
    routes 
  }))
  .mount('#app')
