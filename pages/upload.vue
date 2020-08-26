<template>
  <div class="container">
    <nuxt-link to="/" class="font-bold mb-4">カメラページへ</nuxt-link>
    アップロード(Androidだと少し時間がかかります)
    <FileUploader @onImagePushed="onImagePushed" />
    <ul>
      <li
        v-for="c in captures"
        :key="c.d"
        class="capture flex flex-col items-center"
      >
        <img :src="c" />
        Base64 Encoded:
        <textarea
          :value="c"
          style="width: 400px; height: 100px; resize: both;"
        ></textarea>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/composition-api'
export default {
  name: '',
  setup() {
    const captures = ref<Array<string>>([])
    const onImagePushed = (imageData: string) => {
      captures.value.unshift(imageData)
    }
    return {
      onImagePushed,
      captures,
    }
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}
</style>
