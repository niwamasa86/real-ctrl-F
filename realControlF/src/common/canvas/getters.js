import store from '../../store'

const getOriginCanvas = (options = {}) => {
  const video = document.getElementById(store.getters['video/originTagId'])
  if(video.readyState < 2) return null

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  const size = store.getters['video/originSize']

  canvas.setAttribute('width', size.width)
  canvas.setAttribute('height', size.height)
  canvas.style.display = 'none'

  console.log('getOriginCanvas', options)
  if(options.isMirror) {
    context.scale(-1,1)
    context.drawImage(video, -size.width, 0, size.width, size.height)
  } else {
    context.drawImage(video, 0, 0, size.width, size.height)
  }
  return canvas
}

const getDisplayCanvas = (options = {}) => {
  const video = document.getElementById(store.getters['video/displayTagId'])
  if(video.readyState < 2) return null

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  const size = store.getters['video/displaySize']

  canvas.setAttribute('width', size.width)
  canvas.setAttribute('height', size.height)
  canvas.style.display = 'none'

  console.log('getDisplayCanvas', options)
  if(options.isMirror) {
    context.scale(-1,1)
    context.drawImage(video, -size.width, 0, size.width, size.height)
  } else {
    context.drawImage(video, 0, 0, size.width, size.height)
  }
  return canvas
}

const resizeCanvas = (canvas, size = 400) => {
  // Mirrorした画像をリサイズするので反転処理不要
  const resizeCanvas = document.createElement('canvas')
  const resizeContext = resizeCanvas.getContext('2d')
  const image = new Image()
  image.src = canvas.toDataURL('image/jpeg', 0.9)
  return new Promise((resolve, reject) => {
    image.onload = () => {
      let resizeWidth, resizeHeight
      if (image.width > image.height) {
        resizeWidth = size
        resizeHeight = image.height * size / image.width
      } else {
        resizeHeight = size
        resizeWidth = image.width * size / image.height
      }
      resizeCanvas.width = resizeWidth
      resizeCanvas.height = resizeHeight
      resizeContext.drawImage(image, 0, 0, image.width, image.height, 0, 0, resizeWidth, resizeHeight)
      resolve(resizeCanvas)
    }
  })
}

export {
  getOriginCanvas,
  getDisplayCanvas,
  resizeCanvas
}
