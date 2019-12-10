<template>
  <Container :style="size">
    <OriginVideo
      :id="originTagId"
      :width="origin.width"
      :height="origin.height"
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

const Div = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const Container = styled.div`
  display: fixed;
  overflow-y: hidden;
`

const OriginVideo = styled.video`
	position: relative;
  width: 100%;
  height: 100%;
	opacity: 0.0;
	z-index: ${LAYER.Z_INDEX.CAMERA.ORIGIN_VIDEO};
	pointer-events: none;
  overflow: hidden;
`

const DisplayVideo = styled.video`
	position: relative;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: ${LAYER.Z_INDEX.CAMERA.VIDEO};
`

export default {
  name: 'CameraVideoLayer',
  store,
  components: { Container, OriginVideo, DisplayVideo },
  data: function() {
    return {
      // サイズがnullだとオリジナル画質で設定される
      // originStyle: {
      //   position: 'fixed',
      //   opacity: 0.0,
      //   'z-index': -1
      // }
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
    size(state) {
      return {
        width: '1920px',
        height: '480px'
      }
    },
    ...mapState({
      originTagId: state => state.camera.originTagId,
      displayTagId: state => state.camera.displayTagId,
      isMirror: state => state.camera.isMirror,
      origin: state => state.camera.origin,
      offset: state => state.camera.offset,
    })
  }
}

</script>
