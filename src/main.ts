import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import PrimeVue from 'primevue/config';
import i18n from '@/i18n';
import VueCookies from 'vue-cookies';

/* eslint-disable @typescript-eslint/no-explicit-any*/
// fortawesome icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(fas);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(ElementPlus);
app.use(PrimeVue);
app.use(router);
app.use(i18n as any);
app.use(VueCookies);
app.config.globalProperties.$t = (i18n as any).t2;
app.mount('#app');

(router as any).i18n = i18n;

export default app;
