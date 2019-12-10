<template>
  <Container :id="containerId">
    <Video
      :id="tagId"
      :style="[mirror, deviceChanging]"
      autoplay
      playsinline
      @click="click"
    />
  </Container>
</template>

<script>
import { mapState } from 'vuex'
import store from '../../store'
import Canvas from '../../common/canvas'
import { COLOR, LAYER } from '../../const'
import styled from 'vue-styled-components'

/*
  store/camera setTargetSizeを行う
 */

const Container = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  width: 100%;
  height: 100%;
  justify-items: center;
  align-items: center;
  overflow: hidden;
  background-color: transparent;
`

const Video = styled.video`
	position: relative;
	width: 100%;
	pointer-events: none;
  z-index: ${LAYER.Z_INDEX.CAMERA.VIDEO};
`

export default {
  name: 'CameraVideoLayer',
  store,
  components: { Container, Video },
  data: function() {
    return {
      containerId: 'video-layer-container',
    }
  },
  methods: {
    click: function() {
      console.log('click')
    }
  },
  computed: {
    message(state) {
      return state.operation.type
    },
    mirror(state) {
      if(state.isMirror) return { transform: 'scaleX(-1)' }
      else return { transform: null }
    },
    deviceChanging(state) {
      if(state.isDeviceChanging) return { opacity: 0.05 }
      else return { opacity: 1.0 }
    },
    ...mapState({
      tagId: state => state.camera.tagId,
      isMirror: state => state.camera.isMirror,
      isDeviceChanging: state => state.camera.isDeviceChanging
    })
  },
  mounted: function() {
    const update = () => {
      const dom = document.getElementById(this.containerId)
      this.$store.dispatch('camera/setTargetSize', {
        width: dom.offsetWidth,
        height: dom.offsetHeight
      })
    }
    update()
    window.addEventListener('resize', update)
  }
}

</script>
