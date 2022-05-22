import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'
import Home from './pages/Home.vue';
import RealtimeStreams from './pages/RealtimeStreams.vue';
import FundamentalQuerying from './pages/FundamentalQuerying.vue';
import QueryingArrays from './pages/QueryingArrays.vue';
import RangesCursoring from './pages/RangesCursoring.vue';
import Denormalization from './pages/Denormalization.vue';
import 'open-props/style';
import 'open-props/normalize';
import 'open-props/colors-hsl';
import 'open-props/sizes';

const routes = [
  { path: '/', component: Home },
  { path: '/1/creating-realtime-streams', component: RealtimeStreams },
  { path: '/2/fundamental-querying', component: FundamentalQuerying },
  { path: '/3/querying-arrays', component: QueryingArrays },
  { path: '/4/ranges-cursoring', component: RangesCursoring },
  { path: '/5/joins-denormalization', component: Denormalization },
]

createApp(App)
  .use(createRouter({ 
    history: createWebHistory(),
    routes 
  }))
  .mount('#app')
