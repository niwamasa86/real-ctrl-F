import * as AGENT from '../../const/AGENT'

const mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
  getUserMedia: function(c) {
    return new Promise(function(y, n) {
      (navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia).call(navigator, c, y, n)
    })
  }
} : null)

const getVideoDevices = async () => {
  if(!mediaDevices) {
    console.error('navigator.mediaDevices')
    throw new Error('お使いのブラウザではカメラを使用することができません')
  }
  let devices = await mediaDevices.enumerateDevices()
    .catch((e) => {
      console.log(e)
      throw new Error('使用できるカメラがありません')
    })
  devices = devices.filter( device => device.kind == 'videoinput')
  return devices
}

const getCanvasFromVideo = (video, { mirror }) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  // console.log(video.offsetWidth, video.offsetHeight)
  canvas.setAttribute('width', video.videoWidth)
  canvas.setAttribute('height', video.videoHeight)

  if(mirror) {
    context.scale(-1,1)
    context.drawImage(video, -video.videoWidth, 0, video.videoWidth, video.videoHeight)
  } else {
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
  }
  return canvas
}

export default {
  getVideoDevices,
  getCanvasFromVideo
}

// 		select: ({ commit, state, dispatch }, deviceId) => {
// 			const device =  state.list.find(e => e.deviceId === deviceId)
// 			if(device) {
// 				commit('select', device)
// 				dispatch('video/use', state.selected, { root: true })
// 			}
// 		},
// 		switch: ({ commit, state, dispatch }) => {
// 			if(state.selected) {
// 				let index =  state.list.findIndex(e => e.deviceId === state.selected.deviceId && e.isMirror === state.selected.isMirror)
// 				index = (index + 1) % state.list.length
// 				commit('select', state.list[index])
// 				dispatch('video/use', state.list[index], { root: true })
// 			} else if(state.list.length >= 1) {
// 				commit('select', state.list[0])
// 				dispatch('video/use', state.list[0], { root: true })
// 			} else {
// 				console.error('Length of camera list is 0')
// 			}
// 		},
// 		error: ({ commit }, boolean) => {
// 			commit('error', boolean)
// 		},
// 		errorMessage: ({ commit }, message) => {
// 			commit('errorMessage', message)
// 		}
// 	},
// 	getters: {
// 		list: state => state.list,
// 		selected: state => state.selected,
// 		error: state => state.error,
// 		errorMessage: state => state.errorMessage
// 	}
// }
