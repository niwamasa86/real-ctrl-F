import shuffle from './effect/shuffle'
import zoom from './effect/zoom'
import Variable from './common/variable'
import VariableString from './common/variableString'
import store from '../store'
import Canvas from '../common/canvas'
import Render from '../common/render'

const effect = (data) => {
  const effect = data.mode.effect
  const shufflePromise = () => {
    return new Promise((resolve, reject) => {
      if(!effect.shuffle) {
        resolve()
        return
      }
      if(data.entry.length == 0|| data.results.length == 0) {
        Render.noFace(Canvas.get('face'))
        reject()
        return
      }
      if(effect.shuffle === 'spotlight') {
        const option = {
          showResult: effect.zoom ? true : false
        }
        store.commit('audio/play', 'drumroll')
        shuffle(data, option)
          .then(() => resolve())
          .catch(() => reject())
      }
    })
  }

  const zoomPromise = () => {
    return new Promise((resolve) => {
      if(!effect.zoom) {
        resolve()
        return
      }

      setTimeout(() => {
        store.commit('canvas/topMessage', data.mode.elect.result.name || '')
      }, 1900)
      if(store.getters['layer/window'].height < store.getters['video/displaySize'].height) {
        zoom(data, {}, {
          x: store.getters['layer/left'] + store.getters['layer/width'] / 2,
          y: store.getters['layer/top'] + store.getters['layer/height'] / 2
        }).then(() => resolve())
      } else{
        zoom(data, effect).then(() => resolve())
      }
      Render.color(Canvas.get('photo'), '#f9f9f9')
    })
  }

  return new Promise((resolve, reject) => {
    shufflePromise()
      .then(() => {
        zoomPromise()
          .then(() => {
            resolve()
          })
      })
      .catch(() => reject())
  })
}

const faceImages = (data, faces) => {
  const mode = data.mode
  let variables = []
  variables = variables.concat(Variable.inputs(mode.inputs))
  variables = variables.concat(Variable.variable(mode.elect.variable))
  variables = variables.concat(Variable.map(mode.elect.map))
  variables = variables.concat(Variable.default())

  let faceImages = []
  mode.elect.results.forEach((result, index) => {
    Variable.update('index', index, variables)
    if(result.nameEval) result.name = VariableString(result.nameEval, null, variables)
    faceImages = faceImages.concat(result.index.map((target, index) => {
      Variable.update('index', index, variables)
      if(result.memberNameEval) result.memberName = VariableString(result.memberNameEval, data.entry[target], variables)
      return {
        id: result.id,
        src: faces[target].src,
        index: target,
        name: result.name || '',
        groupName: result.name || '',
        memberName: result.memberName || ''
      }
    }))
  })
  return faceImages
}

export default {
  effect,
  faceImages
}
