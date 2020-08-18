<template>
  <div>
    <button @click="send">osu</button>
  </div>
</template>
<script lang="ts">
import { ref, onMounted } from '@vue/composition-api'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

// const sock =
export default {
  name: '',
  setup() {
    const socket = ref(
      new W3CWebSocket(
        'wss://t1l8i75fh8.execute-api.ap-northeast-1.amazonaws.com/dev'
      )
    )
    onMounted(() => {
      socket.value.onmessage = function (e: any) {
        if (typeof e.data === 'string') {
          console.log(e.data)
        }
      }
    })
    const send = function () {
      // ボタン押下でサーバに値を送る
      socket.value.send(
        JSON.stringify({ message: 'sendmessage', data: 'snap' })
      )
    }
    return { send }
  },
}
</script>
