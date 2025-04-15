<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  sessionStorage.setItem('gameActive', 'true');
});

onBeforeUnmount(() => {
});

function quitGame() {
  if (confirm('Êtes-vous sûr de vouloir abandonner la partie ? Votre progression sera perdue.')) {
    sessionStorage.removeItem('gameActive');
    router.push('/');
  }
}
</script>

<template>
  <div class="container py-5 text-center">
    <h1 class="mb-4">Partie en cours</h1>
    <p class="lead">Cette page simule une partie en cours.</p>
    <p>Si vous essayez de naviguer vers une autre page, vous verrez une confirmation vous demandant si vous voulez quitter la partie.</p>
    
    <div class="mt-5">
      <button class="btn btn-danger" @click="quitGame">
        Abandonner la partie
      </button>
    </div>
  </div>
</template>