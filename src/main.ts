
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App';
import ElementPlus from "element-plus";

import '@/pubilc/css/normalize.less';
import '@/pubilc/css/init.less';
import '@/pubilc/css/style.less';

import 'element-plus/dist/index.css'
import 'vant/lib/index.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(ElementPlus);
app.mount('#app');
