<template>
  <div class="container">
    <TheLoading v-if="isLoading" />
    <div>
      <h1 class="font-semibold text-3xl m-3 block">カメラテスト</h1>
      <nuxt-link to="remote" class="m-4 font-bold block">操作画面へ</nuxt-link>
      アップロード(Androidだと少し時間がかかります)
      <FileUploader @onImagePushed="onImagePushed" />
      <span class="inline-block my-4">または</span>
      <video id="video" ref="video" width="100%" height="500" autoplay></video>
      <div class="mt-4">
        <label
          class="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
          for="room-id"
        >
          紐付けID
        </label>
        <input
          id="room-id"
          v-model="roomId"
          type="number"
          class="bg-gray-200 appearance-none border-2 text-left border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        />
        <button
          id="snap"
          class="px-5 py-3 font-semibold bg-blue-500 text-white my-3 rounded"
          @click="capture()"
        >
          Snap Photo
        </button>
      </div>
      <span class="inline-block">
        {{ message }}
      </span>
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
import { ref, onMounted } from '@vue/composition-api'
import ReconnectingWebSocket from 'reconnecting-websocket'
export default {
  setup(_props: {}, context: any) {
    const video = ref<HTMLVideoElement>(document.createElement('video'))
    const canvas = ref<HTMLCanvasElement>(document.createElement('canvas'))
    const captures = ref<Array<string>>([])
    const isLoading = ref(false)
    const ctx = ref<CanvasRenderingContext2D | null>(null)
    const message = ref('')
    const roomId = ref<Number>(Math.floor(Math.random() * 99))
    const socket = new ReconnectingWebSocket(
      'wss://t1l8i75fh8.execute-api.ap-northeast-1.amazonaws.com/dev'
    )

    const constraints = {
      audio: false,
      video: { facingMode: 'environment' }, // アウトカメラを優先的に使う
    }

    onMounted(() => {
      video.value = context.refs.video

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then((stream: any) => {
          video.value.srcObject = stream
          video.value.play()
        })
      }

      socket.onmessage = function (e: any) {
        console.log(e)
        if (typeof e.data === 'string') {
          if (Number(e.data) === roomId.value) capture()
        }
      }
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
      message.value = '撮影しました'
      setTimeout(() => {
        message.value = ''
      }, 4000)
    }
    return { capture, captures, onImagePushed, isLoading, message, roomId }
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
  flex-direction: column;
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
