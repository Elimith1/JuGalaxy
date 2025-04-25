<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

defineProps<{
  isGameActive: boolean
}>();

const emit = defineEmits<{
  (e: 'setGameActive', value: boolean): void
}>();

const router = useRouter();
const showConfirmation = ref(false);

onMounted(() => {
  emit('setGameActive', true);
});

function quitGame() {
  showConfirmation.value = true;
}

function confirmQuit() {
  emit('setGameActive', false);
  router.push('/');
  showConfirmation.value = false;
}

function cancelQuit() {
  showConfirmation.value = false;
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
    
    <div class="modal" :class="{ 'd-block': showConfirmation }" tabindex="-1" v-if="showConfirmation">
      <!-- changer tabindex=-1 (fix temporaire)-->
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Attention</h5>
            <button type="button" class="btn-close" @click="cancelQuit"></button>
          </div>
          <div class="modal-body">
            <p>Si vous quittez maintenant, vous perdrez votre partie en cours. Êtes-vous sûr de vouloir continuer ?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelQuit">Annuler</button>
            <button type="button" class="btn btn-danger" @click="confirmQuit">Quitter</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>