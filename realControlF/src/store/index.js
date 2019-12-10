import Vue from 'vue'
import Vuex from 'vuex'
import canvas from './canvas'
import camera from './camera'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    canvas,
    camera
  }
})

export default store
