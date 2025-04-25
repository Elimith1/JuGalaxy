<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  isGameActive: boolean;
}>();

const router = useRouter();
const showConfirmation = ref(false);

const handleHomeClick = () => {
  if (props.isGameActive) {
    showConfirmation.value = true;
  } else {
    router.push('/');
  }
};

const confirmReturn = () => {
  router.push('/');
  showConfirmation.value = false;
};

const cancelReturn = () => {
  showConfirmation.value = false;
};
</script>

<template>
  <div>
    <button 
      class="btn btn-primary" 
      @click="handleHomeClick"
      aria-label="Retour à l'accueil"
    >
      Accueil
    </button>

    <div v-if="showConfirmation" class="modal d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Attention</h5>
            <button type="button" class="btn-close" @click="cancelReturn"></button>
          </div>
          <div class="modal-body">
            <p>Si vous quittez maintenant, vous perdrez votre partie en cours. Êtes-vous sûr de vouloir continuer ?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelReturn">Non, continuer la partie</button>
            <button type="button" class="btn btn-danger" @click="confirmReturn">Oui, quitter</button>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
  </div>
</template>