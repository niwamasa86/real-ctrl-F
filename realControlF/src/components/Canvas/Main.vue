<template>
  <Container :id="containerId">
    <canvas
      v-for="(layerId, name) in layers"
      :id="layerId"
      :key="layerId"
      :width="width"
      :height="height"
      :style="[canvasStyle, zLayer[name]]"
      @click="click"
    />
  </Container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import styled from 'vue-styled-components'
import { COLOR } from '../../const'
import Render from '../../common/render'
import Canvas from '../../common/canvas'

/*
  store/canvasへのsize更新
 */

const Container = styled.div`
	display: relative;
	width: 100%;
	height: 100%;
  background-color: transparent;
`

export default {
  name: 'Canvas',
  components: { Container },
  data: function() {
    return {
      containerId: 'canvas-main-container',
      zLayer: {
        background: { 'z-index': 0 },
        photo: { 'z-index': 10 },
        face: { 'z-index': 11 },
        caption: { 'z-index': 12 },
        zoom: { 'z-index': 13 },
        over: { 'z-index': 14 },
        message: { 'z-index': 15 },
        pop: { 'z-index': 16 },
      },
      isClick: false,
      isDoubleTap: false,
      canvasStyle: {
        position: 'absolute',
        top: 0,
        left: 0
      }
    }
  },
  methods: {
    click: function() {

    }
  },
  computed: {
    ...mapState({
      layers: state => state.canvas.layers,
      width: state => state.canvas.width,
      height: state => state.canvas.height,
      photoCanvas: state => state.camera.photoCanvas,
      isPhoto: state => state.camera.isPhoto,
      
    })
  },
  mounted: function() {
    window.addEventListener('resize', () => {
      const dom = document.getElementById(this.containerId)
      this.$store.dispatch('canvas/size', {
        width: dom.offsetWidth,
        height: dom.offsetHeight
      })
    })
    const dom = document.getElementById(this.containerId)
    this.$store.dispatch('canvas/size', {
      width: dom.offsetWidth,
      height: dom.offsetHeight
    })
  },
  watch: {
    isPhoto: function(isPhoto) {
      if(isPhoto) {
        Render.canvas(Canvas.get('photo'), this.photoCanvas)
      }
    },
    width: function() {
      if(this.isPhoto) {
        setTimeout(() => {
          Render.clear(Canvas.get('photo'))
          Render.canvas(Canvas.get('photo'), this.photoCanvas)
        }, 30)
      }
    }
  }
}
</script>
