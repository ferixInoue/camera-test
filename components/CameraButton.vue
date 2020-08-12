<template>
  <a class="photo-button">
    <div class="circle"></div>
    <div class="ring"></div>
  </a>
</template>
<script lang="ts">
import { ref } from '@vue/composition-api'
export default {
  name: '',
  setup() {
    return {}
  },
}
</script>
<style>
.photo-button {
  width: 100px;
  height: 100px;
  position: absolute;
}
.circle {
  position: absolute;
  top: 12%;
  left: 12%;
  bottom: 12%;
  right: 12%;
  border-radius: 100%;
  background-color: rgb(248, 199, 199);
  opacity: 0;
}
.ring {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: 100%;
  border: 0.5em solid rgb(240, 217, 217);
  opacity: 0.8;
}
.photo-button .circle,
.photo-button .ring {
  transition: all 0.25s;
}
.photo-button:hover .circle {
  opacity: 1;
}
.photo-button:active .ring {
  opacity: 1;
}
.photo-button:active .circle {
  opacity: 0.5;
}
</style>
