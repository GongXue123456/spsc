import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;
App.mpType = 'app';

require('@/mock/mock.js');

const app = new Vue(App);
app.$mount();
