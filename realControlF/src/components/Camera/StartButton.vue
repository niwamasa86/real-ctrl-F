<template>
  <div>
    <Button
      :disabled="disabled"
      class="uk-margin uk-button uk-button-primary uk-button-large"
      @click="use"
    >
      <big>カメラを起動する</big>
    </Button>
    <br>
    <div class="uk-form-controls">
      <h5
        v-if="isError"
        class="uk-text-danger"
      >
        {{ error.message }}
      </h5>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import store from '../../store'
import { LAYER } from '../../const'
import styled from 'vue-styled-components'

const Button = styled.button`
  border-radius: 4px;
  width: 220px;
  white-space: nowrap;
  z-index: ${LAYER.Z_INDEX.CAMERA.START_BUTTON};
`

export default {
  name: 'CameraStartButton',
  store,
  components: { Button },
  data() {
    return {
      use: function() {
        store.dispatch('camera/start')
      }
    }
  },
  computed: {
    disabled: function(state) {
      return state.error
    },
    ...mapState({
      isError: state => state.camera.isError,
      error: state => state.camera.error,
    })
  }
}
</script>
