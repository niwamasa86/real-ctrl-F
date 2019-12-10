<template>
  <Item
    @click="click">
    <img
      src="/svg/camera_switch_white.svg"
      :width="ICON_RADIUS"
      align="middle">
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

export default {
  name: 'CameraSwitchButton',
  store,
  components: { Item },
  data() {
    return {
      ICON_RADIUS
    }
  },
  methods: {
    click: function() {
      this.$store.dispatch('camera/switch')
    }
  },
  computed: {}
}

</script>
