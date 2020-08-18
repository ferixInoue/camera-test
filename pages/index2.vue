<template>
  <div ref="playback" class="playback">
    ffffffffffffffffffff
    <button @click="onPushed">saisei</button>
  </div>
</template>
<script lang="ts">
import { ref, onMounted } from '@vue/composition-api'
export default {
  name: '',
  setup(_props: {}, { refs }: any) {
    const onPushed = () => {}
    onMounted(() => {
      // const playbackElement = refs.playback
      const playbackElement = document.getElementById('playback') as any
      // const captureStream = playbackElement.captureStream()
      playbackElement.play()
    })
    return { onPushed }
  },
}
</script>
<style>
span {
  display: none;
}
</style>
