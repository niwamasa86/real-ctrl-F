import { base64StringToBlob } from 'blob-util'

const save = (canvas, fileName = 'save.png') => {
  const image = document.getElementById('download')
  // image.href = window.URL.createObjectURL(base64StringToBlob(canvas.toDataURL()))
  image.href = canvas.toDataURL()
  // image.target = '_blank'
  image.download = fileName
  document.getElementById('download').click()
}

export {
  save
}
