import Vue from 'vue'
import store from './store'

// Components
import Main from './Main'

const app = new Vue({
  el: '#app',
  store,
  render: h => h(Main)
})
