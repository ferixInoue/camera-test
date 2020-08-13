<template>
  <div>
    <input
      type="file"
      accept="image/*"
      class="border-gray-300 p-3"
      @change="onFileChange($event)"
    />
  </div>
</template>
<script lang="ts">
import { ref, defineComponent, SetupContext, watch } from '@vue/composition-api'
export default defineComponent({
  name: '',
  setup(_props: {}, { emit }: SetupContext) {
    const imageData = ref('')
    const onFileChange = (e: any) => {
      const files = e.target.files

      if (files.length > 0) {
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (e: any) => {
          imageData.value = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }
    watch(
      () => imageData.value,
      () => {
        emit('onImagePushed', imageData.value)
      }
    )

    return {
      onFileChange,
      imageData,
    }
  },
})
</script>
