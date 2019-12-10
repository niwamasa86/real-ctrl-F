import { AGENT } from '../../const'

import common from './common'

const mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
  getUserMedia: function(c) {
    return new Promise(function(y, n) {
      (navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia).call(navigator, c, y, n)
    })
  }
} : null)

export default {
  namespaced: true,
  state: {
    // 使用可能なカメラ情報リスト
    list: [],
    // 現在使用中のカメラ
    currentDeviceIndex: 0,
    width: null, // videoの画質（表示サイズではない）
    height: null, // videoの画質（表示サイズではない）
    aspectRatio: null, // アスペクト比 width / height
    targetSize: null, // applyConstraintsに適用
    stream: null,
    canFacingMode: ['user', 'environment'],
    facingMode: 'user',
    isDeviceChanging: false,
    isMirror: true,
    defaultMirror: true, // true: ミラー -> 通常, false: 通常 -> ミラー の順
    isStart: false, // カメラ機能のスタート
    isStream: false, // 映像表示
    isPhoto: false, // 静止画表示
    isError: false,
    isLandspace: true,
    isPortrate: false,
    error: null, // { object }
    tagId: 'origin-video',
    isWindowListen: false,
    photoCanvas: null,
    defaultOrientation: false,
    nextChange: 'start' // 'mirror', 'facingMode', 'device', noFacingMode'
  },
  mutations: {
    list: (state, devices) => {
      state.list = devices
    },
    error: (state, message) => {
      state.isError = true
      state.error = { message: message }
    },
    mirror: (state, boolean) => {
      state.isMirror = boolean
    },
    size: (state, size) => {
      state.width = size.width
      state.height = size.height
      state.aspectRatio =  size.width / size.height
    },
    targetSize: (state, size) => {
      state.target = {
        width: size.width,
        height: size.height,
        aspectRatio: size.width /  size.height
      }
    },
    start: (state, { index, stream }) => {
      state.isStart = true
      state.stream = stream
      state.isDeviceChanging = false
      state.nextChange = ''
    },
    photoMode: (state, canvas) => {
      state.photoCanvas = canvas
      state.isStream = false
      state.isPhoto = true
    },
    streamMode: (state) => {
      state.isStream = true
      state.isPhoto = false
    },
    stop: (state) => {
      state.isStart = false
    },
    lanbspaceMode: (state) => {
      if(!state.isLandspace) {
        state.isLandspace = true
        state.isPortrate = false
      }
    },
    portraitMode: (state) => {
      if(!state.isPortrate) {
        state.isLandspace = false
        state.isPortrate = true
      }
    },
    switch: (state) => {

      state.isDeviceChanging = true

      // 挙動順序
      // 1. 画面を反転
      // 2. facingModeを替える
      // 3. デバイスを替える

      // if isMirror = defaultMirror
      //   isMirror = !isMirror
      // if canFacingMode == length - 1
      //  nextDevice
      // else canFacingMode
      //  length > 1 -> canFacingMode[next],  isMirror = defaultMode
      //  length == 1 -> nextDevice
      //  null -> facingMode = null
      //
      // nextDevice -> currectDeviceIndex+  1, mirror・facingModeを初期値にする

      const facingModeIndex = state.canFacingMode.indexOf(state.facingMode)
      const listLength = state.list ? state.list.length : 1
      const nextDevice = () => {
        state.currentDeviceIndex = (state.currentDeviceIndex + 1) % listLength
        state.isMirror = state.defaultMirror
        state.facingMode = state.canFacingMode.length >= 1 ? state.canFacingMode[0] : null
        state.nextChange = 'device'
      }

      if(state.isMirror == state.defaultMirror) {
        state.isMirror = !state.isMirror
        state.nextChange = 'mirror'
      }
      else if(facingModeIndex == state.canFacingMode.length - 1) {
        nextDevice()
      } else if(!state.facingMode) {
        nextDevice()
      } else {
        if(state.canFacingMode.length > 1) {
          state.facingMode = state.canFacingMode[facingModeIndex + 1]
          state.isMirror = state.defaultMirror
          state.nextChange = 'facingMode'
        }
        else if(state.canFacingMode.length == 1) nextDevice()
        else {
          state.nextChange = 'noFacingMode'
          state.facingMode = null
        }
      }
    },
    errorCurrentFacingMode: (state) => {
      const index = state.canFacingMode.indexOf(state.facingMode)
      if(state.canFacingMode.length > 1) state.facingMode = state.canFacingMode[(index + 1) % state.canFacingMode.length]
      else state.facingMode = null
      if(index >= 0) state.canFacingMode.splice(index, 1)
    }
  },
  actions: {
    // デバイス情報の取得
    init: async ({ commit, state, dispatch }) => {
      // 横画面，縦画面判定（開始前にViewで使用する）
      if(!state.isWindowListen) {
        state.isWindowListen = true
        // Androidではソフトウェアキーボード表示でresizeになるが，カメラ画面で入力はないので画面サイズで判定する
        window.addEventListener('resize', () => {
          if(state.isLandspace && window.innerWidth < window.innerHeight) {
            commit('portraitMode')
            if(state.isStart) dispatch('start')
          } else if(state.isPortrate && window.innerWidth > window.innerHeight) {
            commit('lanbspaceMode')
            if(state.isStart) dispatch('start')
          }
        })
        if(state.isLandspace && window.innerWidth < window.innerHeight) {
          commit('portraitMode')
        } else if(state.isPortrate && window.innerWidth > window.innerHeight) {
          commit('lanbspaceMode')
        }
      }
    },
    setTargetSize: async ({ commit, state, dispatch }, { width, height }) => {
      commit('targetSize', { width, height })
    },
    // カメラを起動する
    start: async ({ commit, state, dispatch }) => {

      // デバイスリストの更新
      const devices = await common.getVideoDevices()
        .catch((errorMessage) => {
          commit('error', errorMessage)
          return []
        })
      commit('list', devices)

      // デバイスの選択
      const device = devices[state.currentDeviceIndex] ? devices[state.currentDeviceIndex] : null
      if(!device) return

      // 画面反転の変更時はstreamを更新しない
      if(state.stream && state.nextChange == 'mirror') {
        commit('start', { stream: state.stream })
        return
      }

      // このタイミングでfacingModeの設定が必要
      // facingModeでエラーが出たら，そのモードをやめてやり直す

      let stream = null
      let isLoop = true
      while(!stream && isLoop) {
        stream = await mediaDevices.getUserMedia({
          video: {
            deviceId: device.deviceId,
            facingMode: state.facingMode ? { exact: state.facingMode } : null,
          },
          audio: false
        })
          .catch((error) => {
            // 使えるfacingModeがなくなるまで続ける
            if(error.constraint == 'facingMode' && state.canFacingMode.length >= 1) {
              commit('errorCurrentFacingMode')
            } else {
              isLoop = false
              console.error(error)
            }
          })
      }

      if(stream) {
        const [track] = stream.getVideoTracks()
        const capabilities = track.getCapabilities()

        // maxにすると適用されない場合がある おそらくmediaDeviceの制限として1920*1080以上は無視される
        // iOSの縦画面の場合 縦横が逆に適用される
        //  width: 1920適用でheight: 1920になる

        const constraints = {}
        if(AGENT.isMobile && state.isPortrate) {
          constraints.height = { ideal: Math.min(1080, capabilities.height.max) }
        } else if(!AGENT.isMobile && state.isPortrate) {
          constraints.height = { ideal: Math.min(1080, capabilities.height.max) }
          constraints.aspectRatio = { ideal: Math.max(state.target.aspectRatio, capabilities.aspectRatio.min) }
        } else {
          constraints.width = { ideal: Math.min(1920, capabilities.width.max) }
        }

        // 同時に適用すると無視されるパラメータがあるので分け適用する
        // サイズの適用
        await track.applyConstraints(constraints)
          .catch((error) => {
            console.log(error)
          })

        // frameRateの適用
        await track.applyConstraints({
          frameRate: 60
        })
          .catch((error) => {
            console.log(error)
          })

        console.log('mediaDevices capabilities', capabilities)
        console.log('mediaDevices applyConstraints', constraints)
        console.log('mediaDevices getSettings', track.getSettings())
        // console.log('mediaDevices Support', mediaDevices.getSupportedConstraints())

        // 許可後は情報が異なるので更新する
        const devices = await common.getVideoDevices()
        commit('list', devices)

        // videoタグに適用
        const video = document.getElementById(state.tagId)
        video.srcObject = stream
        video.onloadedmetadata = () => {
          console.log('videoSize', video.videoWidth, video.videoHeight)
          commit('size', {
            width: video.videoWidth,
            height: video.videoHeight
          })
          commit('streamMode')
          commit('start', { stream })
        }
      }
    },
    // カメラを停止する
    stop: async ({ commit, state, dispatch }) => {
    },
    // 画像を返す
    take: async ({  commit, state, dispatch }) => {
      const video = document.getElementById(state.tagId)
      const canvas = common.getCanvasFromVideo(video, { mirror: state.isMirror })
      commit('photoMode', canvas)
    },
    // カメラの変更
    switch: async ({ commit, state, dispatch }) => {
      commit('switch')
      dispatch('start')
    },
    // エラー
    error: ({ commit }, boolean) => {
      commit('error', boolean)
    },
    errorMessage: ({ commit }, message) => {
      commit('errorMessage', message)
    },
    mirror: function({ commit }, boolean) {
      commit('setMirror', boolean)
    },

    // 画像読み込みの場合に使用
    // setOriginSize: function({ commit, state, dispatch, rootState }, size) {
    // 	// commit('canvas/image', true, {root: true})
    // 	state.camera.origin.width = size.width,
    // 	state.camera.origin.height = size.height
    // 	state.camera.aspectRatio = state.originSize.height / state.originSize.width
    // },
  },
  getters: {
    list: state => state.list,
    selected: state => state.selected,
    error: state => state.error,
    errorMessage: state => state.errorMessage,
    originTagId: state => state.originTagId, // @TODO const
    displayTagId: state => state.displayTagId // @TODO const

  }
}
