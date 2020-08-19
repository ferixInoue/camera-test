<template>
  <div class="container">
    <nuxt-link to="/" class="m-4 font-bold">カメラ画面へ</nuxt-link>
    <button
      class="py-4 px-5 bg-gray-300 text-lg rounded hover:bg-gray-600 focus:outline-none hover:text-white transition duration-300 tracking-widest"
      @click="onPushed"
    >
      撮影する
    </button>
    <span class="inline-block p-4">{{ message }}</span>
  </div>
</template>
<script lang="ts">
import { ref, onMounted } from '@vue/composition-api'
import ReconnectingWebSocket from 'reconnecting-websocket'
export default {
  name: '',
  setup() {
    const socket = new ReconnectingWebSocket(
      'wss://t1l8i75fh8.execute-api.ap-northeast-1.amazonaws.com/dev'
    )

    const message = ref('')
    onMounted(() => {
      socket.onmessage = function (e: any) {
        if (typeof e.data === 'string') {
          console.log(e.data)
        }
      }
    })
    const onPushed = function () {
      socket.send(JSON.stringify({ message: 'sendmessage', data: 'snap' }))
      message.value = '撮影しました'
      setTimeout(() => {
        message.value = ''
      }, 4000)
    }
    return { onPushed, message }
  },
}
</script>
<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>
