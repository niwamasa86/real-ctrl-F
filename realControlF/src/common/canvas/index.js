import store from '../../store'
import * as getter from './getters'

const get = (layer) => {
  return document.getElementById(store.getters['canvas/layers'][layer] || layer)
}

const render = (layer, callback) => {
  const layers = store.getters['canvas/layers']
  const canvas = document.getElementById(layers[layer] || layer)
  const next = () => {
    window.requestAnimationFrame(nextRender)
  }
  const nextRender = () => {
    callback(next, canvas)
  }
  nextRender()
}

export default {
  get,
  render,
  ...getter
}
