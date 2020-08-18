<template>
  <div class="container">
    <TheLoading v-if="isLoading" />
    <div>
      <h1 class="font-semibold text-3xl m-3">カメラテスト</h1>
      <input v-model="message" type="text" /><button @click="onMessageSent">
        send</button
      ><br />
      <div>{{ messages }}</div>
      <video id="video" ref="video" width="100%" height="500" autoplay></video>
      <div>
        <button
          id="snap"
          class="px-5 py-3 font-semibold bg-blue-500 text-white my-3 rounded"
          @click="capture()"
        >
          Snap Photo
        </button>
      </div>
      <canvas id="canvas" ref="canvas"></canvas>
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
  </div>
</template>

<script lang="ts">
// import io from 'socket.io-client'
import { ref, onMounted } from '@vue/composition-api'

export default {
  setup(_props: {}, { refs }: any) {
    const video = ref<HTMLVideoElement>(document.createElement('video'))
    const canvas = ref<HTMLCanvasElement>(document.createElement('canvas'))
    const captures = ref<Array<string>>([])
    const width = ref(500)
    const height = ref(500)
    const isLoading = ref(false)
    const socket = ref<any>('')
    const ctx = ref<CanvasRenderingContext2D | null>(null)
    const message = ref('')
    const messages = ref<object[]>([])

    const onMessageSent = () => {
      message.value = ''
      /* Emit events */

      const now = new Date() // 現在時刻（世界標準時）を取得
      now.setTime(now.getTime() + 1000 * 60 * 60 * 9) // 日本時間に変換
      const _now = now.toJSON().split('T')[1].slice(0, 5) // 時刻のみを取得

      // メッセージオブジェクトを作る
      const _message = {
        user: socket.value.id,
        date: _now,
        text: message.value.trim(),
      }

      // // 自身（Vueインスタンス）のデータオブジェクトにメッセージを追加する
      // messages.value.push(_message)
      // console.log(_message)
      // // サーバー側にメッセージを送信する
      // socket.value.emit('ev', _message)
      // // input要素を空にする
      message.value = ''
    }
    const constraints = {
      audio: false,
      video: { facingMode: 'environment' }, // アウトカメラを優先的に使う
    }

    onMounted(() => {
      // socket.value = io()
      // // サーバー側で保持しているメッセージを受信する
      // socket.value.on('news', (message: any) => {
      //   messages.value.push(message || {})
      //   console.log(message)
      // })
      // video.value = refs.video
      // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      //   navigator.mediaDevices.getUserMedia(constraints).then((stream: any) => {
      //     video.value.srcObject = stream
      //     video.value.play()
      //     // recorder.value = new MediaRecorder(stream)
      //   })
      // }
    })

    const onImagePushed = (imageData: string) => {
      captures.value.unshift(imageData)
    }

    /**
     * Canvasオブジェクト取得
     */
    const getCanvas = (
      canvasId: string,
      width: number,
      hegiht: number
    ): HTMLCanvasElement => {
      const _canvas = document.createElement(canvasId) as HTMLCanvasElement
      _canvas.height = hegiht
      _canvas.width = width
      return _canvas
    }

    const capture = () => {
      isLoading.value = true
      if (!ctx.value) {
        canvas.value = getCanvas(
          'canvas',
          video.value.videoWidth,
          video.value.videoHeight
        )
        ctx.value = canvas.value.getContext('2d') as CanvasRenderingContext2D
      }
      if (!canvas.value) return
      ctx.value.drawImage(
        video.value,
        0,
        0,
        video.value.videoWidth,
        video.value.videoHeight
      )
      captures.value.unshift(canvas.value.toDataURL('image/jpeg'))
      isLoading.value = false
    }
    return {
      capture,
      captures,
      height,
      width,
      onImagePushed,
      isLoading,
      message,
      messages,
      onMessageSent,
    }
  },
}
</script>

<style>
#canvas {
  display: none;
}
#video {
  background-color: #000;
}
html,
body {
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 400;
}
h1 {
  font-weight: 800;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: Nato san JP, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
