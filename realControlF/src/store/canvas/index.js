export default {
  namespaced: true,
  state: {
    layers: {
      background: 'background-layer',
      photo: 'photo-layer',
      face: 'face-layer',
      caption: 'caption-layer',
      zoom: 'zoom-layer',
      over: 'over-layer',
      message: 'message-layer',
      pop: 'pop-layer'
    },
    topMessage: '',
    width: 0,
    height: 0
  },
  mutations: {
    topMessage: function(state, message) {
      state.topMessage = message
    },
    setSize: function(state, size) {
      state.width = size.width
      state.height = size.height
    }
  },
  actions: {
    size: function({ commit }, size) {
      commit('setSize', size)
    }
  },
  getters: {
    // common/canvasで使用 @TODO const
    layers: state => state.layers
  }
}
