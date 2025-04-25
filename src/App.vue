<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { ref } from 'vue'

const isGameActive = ref(false)

const setGameActive = (active: boolean) => {
  isGameActive.value = active
}
</script>

<template>
  <div>
    <NavBar :is-game-active="isGameActive" />
    <RouterView :is-game-active="isGameActive" @set-game-active="setGameActive" />
  </div>
</template>