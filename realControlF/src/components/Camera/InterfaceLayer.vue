<template>
  <Div>
    <!-- 横向き画面 -->
    <LandscapeContainer
      v-if="isLandspace">
      <!-- カメラ未起動時 -->
      <LandscapeEntireItem v-if="!isStart">
        <StartButton />
      </LandscapeEntireItem>
      <LandscapeCenterItem v-if="!isStart">
        <LocalLibraryButton />
      </LandscapeCenterItem>

      <!-- カメラ起動時 -->
      <LandscapeTopItem v-if="isStart">
        <SwitchButton />
      </LandscapeTopItem>
      <LandscapeCenterItem v-if="isStart">
        <ShutterButton />
      </LandscapeCenterItem>
      <LandscapeBottomItem v-if="isStart">
        <LocalLibraryButton />
      </LandscapeBottomItem>
    </LandscapeContainer>

    <!-- 縦向き画面 -->
    <PortraitContainer
      v-if="isPortrate">
      <!-- カメラ未起動時 -->
      <PortraitEntireItem v-if="!isStart">
        <StartButton />
      </PortraitEntireItem>
      <PortraitCenterItem v-if="!isStart">
        <LocalLibraryButton />
      </PortraitCenterItem>

      <!-- カメラ起動時 -->
      <PortraitLeftItem v-if="isStart">
        <SwitchButton />
      </PortraitLeftItem>
      <PortraitCenterItem v-if="isStart">
        <ShutterButton />
      </PortraitCenterItem>
      <PortraitRightItem v-if="isStart">
        <LocalLibraryButton />
      </PortraitRightItem>
    </PortraitContainer>
  </Div>
</template>

<script>
import { mapState } from 'vuex'
import store from '../../store'
import styled from 'vue-styled-components'
import { LAYER } from '../../const'

import StartButton from './StartButton'
import ShutterButton from './ShutterButton'
import SwitchButton from './SwitchButton'
import LocalLibraryButton from './LocalLibraryButton'

// Landscape（横長） Portrait（縦長）

const Div = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent; 
`

const LandscapeContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 120px;
	grid-template-rows: 1fr 80px 100px 80px 1fr;
	width: 100%;
	height: 100%;
	justify-items: center;
  align-items: center;
	z-index: ${LAYER.Z_INDEX.CAMERA.UI_BUTTON};
`

const LandscapeTopItem = styled.div`
	grid-column: 2;
	grid-row: 2;
`

const LandscapeCenterItem = styled.div`
	grid-column: 2;
	grid-row: 3;
`

const LandscapeBottomItem = styled.div`
	grid-column: 2;
	grid-row: 4;
`

const LandscapeEntireItem = styled.div`
	grid-column: 1 / 3;
	grid-row: 1 / 6;
  z-index: ${LAYER.Z_INDEX.CAMERA.START_BUTTON};
`

const PortraitContainer = styled.div`
	display: grid;
	grid-template-columns: minmax(0px, 1fr) 80px minmax(80px, 100px) 80px minmax(0px, 1fr);
	grid-template-rows: 1fr 135px;
	width: 100%;
	height: 100%;
	justify-items: center;
  align-items: center;
  justify-content: space-evenly;
  align-content: space-evenly;
	z-index: ${LAYER.Z_INDEX.CAMERA.UI_BUTTON};
`

const PortraitLeftItem = styled.div`
	grid-column: 2;
	grid-row: 2;
`

const PortraitCenterItem = styled.div`
	grid-column: 3;
	grid-row: 2;
`

const PortraitRightItem = styled.div`
	grid-column: 4;
	grid-row: 2;
`

const PortraitEntireItem = styled.div`
	grid-column: 1 / 6;
	grid-row: 1 / 3;
  z-index: ${LAYER.Z_INDEX.CAMERA.START_BUTTON};
`

export default {
  name: 'CameraInterfaceLayer',
  store,
  components: {
    Div,
    LandscapeContainer, PortraitContainer,
    LandscapeCenterItem, PortraitCenterItem,
    LandscapeTopItem, PortraitLeftItem,
    LandscapeBottomItem, PortraitRightItem,
    LandscapeEntireItem, PortraitEntireItem,
    SwitchButton,
    ShutterButton,
    LocalLibraryButton,
    StartButton
  },
  data: function() {
    return {}
  },
  methods: {},
  computed: {
    ...mapState({
      isStart: state => state.camera.isStart,
      isPhoto: state => state.camera.isPhoto,
      isStream: state => state.camera.isStream,
      isLandspace: state => state.camera.isLandspace,
      isPortrate: state => state.camera.isPortrate
    })
  }
}
</script>
