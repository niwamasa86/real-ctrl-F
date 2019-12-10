import * as uploading from './uploading'
import * as timer from './timer'
import * as face from './face'
import * as message from './message'
import * as order from './order'
import * as group from './group'

const animation = (callback) => {
  const next = () => {
    window.requestAnimationFrame(nextRender)
  }
  const nextRender = () => {
    callback(next)
  }
  nextRender()
}

const clear = (canvas) => {
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
}

const canvas = (canvas, imageCanvas) => {
  const context = canvas.getContext('2d')
  const imageContext = imageCanvas.getContext('2d')
  const image = imageContext.getImageData(0, 0, imageCanvas.width, imageCanvas.height)
  // context.scale(1/(imageCanvas.width/canvas.width), 1/(imageCanvas.height/canvas.height))
  context.putImageData(image, 0, 0)
  context.fillStyle = '#999999'
  context.fillRect(0, 0, 30, 30)
}

const image = (canvas, imageData) => {
  const context = canvas.getContext('2d')
  context.putImageData(imageData, 0, 0)
}

const color = (canvas, color = '#ffffff') => {
  const context = canvas.getContext('2d')
  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
}

const blackOverlay = (canvas, opacity = 1.0) => {
  const context = canvas.getContext('2d')
  context.fillStyle = `rgba(0, 0, 0, ${opacity})`
  context.fillRect(0, 0, canvas.width, canvas.height)
}

const whiteOverlay = (canvas, opacity = 1.0) => {
  const context = canvas.getContext('2d')
  context.fillStyle = `rgba(249, 249, 249, ${opacity})`
  context.fillRect(0, 0, canvas.width, canvas.height)
}

export default {
  animation,
  clear,
  canvas,
  image,
  color,
  blackOverlay,
  whiteOverlay,
  ...uploading,
  ...timer,
  ...face,
  ...message,
  ...order,
  ...group
}
