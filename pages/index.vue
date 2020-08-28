<template>
  <div class="container">
    <MqttWebsock :param="param" />
    <div>
      <h1 class="font-semibold text-3xl m-3 block">カメラテスト</h1>
      <!--
      <div>
        <label
          class="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
          for="topic"
        >
          トピック
        </label>
        <input
          id="topic"
          ref="topicInput"
          type="text"
          class="bg-gray-200 appearance-none border-2 text-left border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        />
        <button @click="onPushed">変更</button>
      </div> -->
      <span
        v-if="isCameraMode"
        class="cursor-pointer font-semibold text-gray-600"
        @click="toggleMode"
      >
        アップロードへ
      </span>
      <span
        v-else
        class="cursor-pointer font-semibold text-gray-600"
        @click="toggleMode"
      >
        カメラへ
      </span>
      <div v-show="isCameraMode" class="mt-4 flex flex-col">
        <video
          id="video"
          ref="video"
          width="100%"
          height="500"
          autoplay
        ></video>
        <button
          id="snap"
          class="transition duration-700 focus:outline-none hover:bg-blue-200 px-5 py-3 font-semibold bg-blue-500 text-white my-3 rounded"
          @click="capture()"
        >
          {{snapShotMessage}}
        </button>
        <button
          id="snap"
          v-show="captures.length > 0"
          class="transition duration-700 focus:outline-none hover:bg-blue-200 px-5 py-3 font-semibold bg-blue-500 text-white my-3 rounded"
          @click="send()"
        >
          送信する
        </button>
      </div>
      <div v-show="!isCameraMode" class="mt-4 flex flex-col">
        <FileUploader @onImagePushed="onImagePushed" />
                <button
          id="snap"
          v-show="isUploaded"
          class="transition duration-700 focus:outline-none hover:bg-blue-200 px-5 py-3 font-semibold bg-blue-500 text-white my-3 rounded"
          @click="send()"
        >
          送信する
        </button>
      </div>
      <span class="inline-block">
        {{ message }}
      </span>
      <canvas id="canvas" ref="canvas"></canvas>
      <div v-if="captures.length > 0 ">
              <label
          class="block text-gray-500 font-bold text-left mb-1 md:mb-0 pr-4"
          for="upload"
        >
          送信する画像
        </label>
      <img id="upload" :src="captures[0]" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed, SetupContext } from '@vue/composition-api'
import ReconnectingWebSocket from 'reconnecting-websocket'
export default {
  name: 'Index',
  setup(_props: {}, context: any) {
    const video = ref<HTMLVideoElement>(document.createElement('video'))
    const canvas = ref<HTMLCanvasElement>(document.createElement('canvas'))
    const captures = ref<Array<string>>([])
    const isLoading = ref(false)
    const ctx = ref<CanvasRenderingContext2D | null>(null)
    const message = ref('')
    const roomId = ref<Number>(Math.floor(Math.random() * 99))

    const topic = ref<string>('Metadata_MQTT')
    const isUploaded = ref(false)
    const param = ref('')

    const isCameraMode = ref(true)
    const toggleMode = () => {
      isCameraMode.value = !isCameraMode.value
    }
    const onPushed = () => {
      // topic.value = context.refs.topicInput.value
    }
    const constraints = {
      audio: false,
      video: { facingMode: 'environment' }, // アウトカメラを優先的に使う
    }

    const snapShotMessage = computed(()=>{
      if (captures.value.length > 0) return "もう一度撮影する"
      return "撮影"
    })
    const send = () => {
      if (captures.value.length === 0) return

      const _param = JSON.stringify({
        data: { image: captures.value[0] },
      })
      console.log(topic.value)
      if (_param !== param.value) param.value = _param
      context.root.$router.push("/thankyou")
    }
    onMounted(() => {
      // context.refs.topicInput.value = topic.value
      video.value = context.refs.video

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then((stream: any) => {
          video.value.srcObject = stream
          video.value.play()
        })
      }
    })

    const onImagePushed = (imageData: string) => {
      captures.value.unshift(imageData)
      isUploaded.value=true
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
    return {
      capture,
      captures,
      onImagePushed,
      isLoading,
      onPushed,
      message,
      snapShotMessage,
      roomId,
      send,
      param,
      toggleMode,
      isCameraMode,

      isUploaded
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
