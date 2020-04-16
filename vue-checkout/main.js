import Vue from 'vue'
import vuetify from './plugins/vuetify'
import './filters/currency'
import App from './App.vue'
import store from './store/store'
import PageManager from '../assets/js/theme/page-manager'

Vue.config.productionTip = false
Vue.config.devtools = true;

export default class Checkout extends PageManager {
  onReady() {
    new Vue({
      el: '#app',
      vuetify,
      store,
      render: h => h(App),
    });
  }
}