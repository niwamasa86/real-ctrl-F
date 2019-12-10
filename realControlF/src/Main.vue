<template>
  <Container>
    <Main>
      <VideoLayer />
    </Main>
    <Main>
      <InterfaceLayer :style="cameraBackground" />
    </Main>
    <Main>
      <Canvas />
    </Main>
  </Container>
</template>

<script>
import { mapState } from 'vuex'
import store from './store'
import styled from 'vue-styled-components'

// Components
import VideoLayer from './components/Camera/VideoLayer'
import InterfaceLayer from './components/Camera/InterfaceLayer'
import Canvas from './components/Canvas/Main.vue'

store.dispatch('camera/init')

const Container = styled.div`
	display: grid;
	grid-template-columns: 100%;
	grid-template-rows: 100%;
	width: 100vw;
	height: 100vh;
  overflow-y: hidden;
  margin: 0;
  padding: 0;
`

const Main = styled.div`
	grid-column: 1;
	grid-row: 1;
	background: #FFFFFF;

`

export default {
  name: 'RealControlF',
  store,
  components: {
    VideoLayer, InterfaceLayer,
    Container, Main, Canvas
  },
  data() {
    return {
      hidden: {
        'overflow': 'hidden'
      }
    }
  },
  methods: {},
  computed: {
    cameraBackground: function(state) {
      if(state.isStart) return { 'background': '#000000' }
      else return {}
    },
    ...mapState({
      isStart: state => state.camera.isStart,
      isPhoto: state => state.camera.isPhoto,
      isStream: state => state.camera.isStream
    })
  },
  watch: {
  }
}

</script>
