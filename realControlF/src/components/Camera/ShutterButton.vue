<template>
  <Center>
    <Item>
      <a><img
        :style="shutterIcon.size"
        :src="shutterIcon.outerSrc"
        align="middle"
        @click="shutter"
      ></a>
    </Item>
    <Item>
      <a><img
        :style="shutterIcon.innerSize"
        :src="shutterIcon.innerSrc"
        align="middle"
        @click="shutter"
      ></a>
    </Item>
  </Center>
</template>

<script>
import { mapState } from 'vuex'
import store from '../../store'
import { COLOR, LAYER } from '../../const'
import styled from 'vue-styled-components'

const Center = styled.div`
	display: grid;
	grid-template-columns: 1fr 80px 1fr;
	grid-template-rows: 1fr 80px 1fr;
	width: 100%;
	height: 100%;
`
// align-items: center;

const Item = styled.div`
	grid-column: 2;
	grid-row: 2;
	z-index: ${LAYER.Z_INDEX.CAMERA.UI_BUTTON};
`

export default {
  name: 'CameraShutterButton',
  store,
  components: {
    Center, Item
  },
  data() {
    const SHUTTER_ICON_RUDIUS = 80
    return {
      shutterIconRudius: SHUTTER_ICON_RUDIUS,
      shutterIconInnerRudius: SHUTTER_ICON_RUDIUS, // 縮小animation用
      shutterIconSource: {
        outer: {
          src: '/svg/camera_shutter_outer.svg',
        },
        inner: {
          src: '/svg/camera_shutter_inner.svg',
        },
        outerBlack: {
          src: '/svg/camera_shutter_outer_black.svg',
        },
        innerBlack: {
          src: '/svg/camera_shutter_inner_black.svg',
        }
      }
    }
  },
  methods: {
    shutter: function(e) {
      // API.downloadDom('canvas-layer')
      e.stopPropagation()
      this.shutterIconInnerRudius = this.shutterIconRudius
      let reduction = true
      const loop = () => {
        if(reduction) {
          this.shutterIconInnerRudius--
          if(this.shutterIconInnerRudius >= this.shutterIconRudius - 6) window.requestAnimationFrame(loop)
          else reduction = false
        }
        if(!reduction) {
          this.shutterIconInnerRudius++
          if(this.shutterIconInnerRudius < this.shutterIconRudius) window.requestAnimationFrame(loop)
          else this.shutterIconInnerRudius = this.shutterIconRudius
        }
      }
      store.dispatch('camera/take')
      // サクサク感
      this.shutterIconInnerRudius--
      loop()
    },
  },
  computed: {
    shutterIcon: function(state) {
      return {
        outerSrc: state.isStart ? this.shutterIconSource.outer.src : this.shutterIconSource.outerBlack.src,
        innerSrc: state.isStart ? this.shutterIconSource.inner.src : this.shutterIconSource.innerBlack.src,
        size: {
          width: this.shutterIconRudius + 'px',
          height: this.shutterIconRudius + 'px',
        },
        innerSize: {
          width: this.shutterIconInnerRudius + 'px',
          height: this.shutterIconInnerRudius + 'px',
          'margin-left': (this.shutterIconRudius - this.shutterIconInnerRudius) / 2 + 'px',
          'margin-top': (this.shutterIconRudius - this.shutterIconInnerRudius) / 2 + 'px'
        }
      }
    },
    ...mapState({
      isStart: state => state.camera.isStart
    })
  }
}

</script>

<style>
</style>
