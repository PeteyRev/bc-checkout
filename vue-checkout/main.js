import Vue from 'vue'
import vuetify from './plugins/vuetify'
import './plugins/vuelidate'
import App from './App.vue'
import PageManager from '../assets/js/theme/page-manager'

Vue.config.productionTip = false
Vue.config.devtools = true;

export default class Checkout extends PageManager {
  onReady() {
    new Vue({
      el: '#app',
      vuetify,
      render: h => h(App),
    });
  }
}