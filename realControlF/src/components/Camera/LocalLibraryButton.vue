<template>
  <Item
    @click="inputFile">
    <img
      src="/svg/local_library.svg"
      :width="ICON_RADIUS"
      align="middle">
    <Hidden>
      <input
        id="localFile"
        type="file"
        @change="setLocalImage">
    </Hidden>
  </Item>
</template>

<script>
import { mapState } from 'vuex'
import store from '../../store'
import { LAYER } from '../../const'
import styled from 'vue-styled-components'

const ICON_RADIUS = 56

const Item = styled.div`
  position: relative;
	z-index: ${LAYER.Z_INDEX.CAMERA.UI_BUTTON};
  width: ${ICON_RADIUS}px;
  height: ${ICON_RADIUS}px;
  background-color: rgba(30, 30, 30, 0.55);
  border-radius: 50%;
`

const Hidden = styled.div`
	visibility: hidden;
`

export default {
  name: 'LocalLibraryButton',
  store,
  components: { Item, Hidden },
  data() {
    return {
      ICON_RADIUS
    }
  },
  methods: {
    inputFile: function(e) {
      store.commit('audio/interaction')
      const localFile = document.getElementById('localFile')
      const event = document.createEvent( 'MouseEvents' )
      event.initEvent('click', false, true)
      localFile.dispatchEvent(event)
    },
    setLocalImage: function(e) {
      const fileData = e.target.files[0]
      console.log(fileData)
      if (!fileData.type.match('image.*')) {
        alert('画像ファイルを指定してください')
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        store.commit('audio/play', 'shutter')
        const image = new Image()
        image.src = reader.result
        image.onload = () => {
          const originCanvas = document.createElement('canvas')
          originCanvas.width = image.width
          originCanvas.height = image.height
          originCanvas.getContext('2d').drawImage(image, 0, 0)

          store.dispatch('video/setOriginSize', {
            width: image.width,
            height: image.height
          })

          setTimeout(() => {
            const displaySize = store.getters['video/displaySize']
            const displayCanvas = document.createElement('canvas')
            displayCanvas.width = displaySize.width
            displayCanvas.height = displaySize.height
            displayCanvas.getContext('2d').drawImage(image, 0, 0, displaySize.width, displaySize.height)
            store.dispatch('operation/uploading', {
              origin: originCanvas,
              display: displayCanvas,
              from: 'library'
            })
          }, 10)
        }
      }
      reader.readAsDataURL(fileData)
    }
  },
  computed: {
    ...mapState({
      fullscreen: state => state.input.fullscreen,
      layerMap: state => state.layer.map,
      window: state => state.layer.window,
      isHeader: state => state.layer.isHeader,
      header: state => state.layer.header,
      focus: state => state.layer.focus,
      selected: state => state.device.selected,
      map: state => state.layer.map,
      type: state => state.operation.type,
      ready: state => state.video.ready,
      layerInner: state => state.layer.inner
    })
  }
}

</script>
