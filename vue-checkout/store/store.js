import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

Vue.config.devtools = true;

export default new Vuex.Store({
  state: {
    storeConfig: {},
    panel: 0
  },
  mutations: {
    setStoreConfig(state, payload) {
      state.storeConfig = payload;
    },
    setPanel(state, payload) {
      state.panel = payload;
    }
  },
  actions: {
    setStoreConfig(store, payload) {
      store.commit('setStoreConfig', payload);
    },
    setPanel(store, payload) {
      store.commit('setPanel', payload);
    }
  },
});
