<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { PlayerCharacter } from '../types/types.ts';

const props = defineProps<{
  isGameActive: boolean,
  playerName?: string,
  shipName?: string
}>();

const emit = defineEmits<{
  (e: 'setGameActive', value: boolean): void
}>();

const router = useRouter();
const showConfirmation = ref(false);
const currentMission = ref(1);

const playerCharacter = reactive<PlayerCharacter>({
  name: props.playerName || '',
  experience: 'Maitre',
  credits: 0,
  shipName: props.shipName || '',
  health: 100
});

watch(() => props.playerName, (newName) => {
  if (newName) {
    playerCharacter.name = newName;
  }
});

watch(() => props.shipName, (newShipName) => {
  if (newShipName) {
    playerCharacter.shipName = newShipName;
  }
});

onMounted(() => {
  emit('setGameActive', true);
  
  if (props.playerName) {
    playerCharacter.name = props.playerName;
  }
  
  if (props.shipName) {
    playerCharacter.shipName = props.shipName;
  }
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
  <div class="container py-5">
    <div class="row">
      <div class="col-md-4">
        <div class="card shadow mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Votre personnage</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <h6>Nom:</h6>
              <p class="text-primary fw-bold">{{ playerCharacter.name }}</p>
            </div>
            <div class="mb-3">
              <h6>Expérience:</h6>
              <p class="text-success">{{ playerCharacter.experience }}</p>
            </div>
            <div class="mb-3">
              <h6>Crédits Galactiques:</h6>
              <p class="text-warning fw-bold">{{ playerCharacter.credits }} CG</p>
            </div>
            <div class="mb-3">
              <h6>Vaisseau:</h6>
              <p>{{ playerCharacter.shipName }}</p>
            </div>
            <div>
              <h6>Vie du vaisseau:</h6>
              <div class="progress">
                <div 
                  class="progress-bar" 
                  role="progressbar" 
                  :style="{ width: playerCharacter.health + '%' }"
                  :class="{
                    'bg-success': playerCharacter.health > 60,
                    'bg-warning': playerCharacter.health > 30 && playerCharacter.health <= 60,
                    'bg-danger': playerCharacter.health <= 30
                  }"
                  :aria-valuenow="playerCharacter.health" 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                >
                  {{ playerCharacter.health }}%
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card shadow">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">Informations de mission</h5>
          </div>
          <div class="card-body">
            <p class="fs-5">Mission actuelle: <span class="fw-bold">{{ currentMission }}/5</span></p>
          </div>
        </div>
      </div>
      
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-header bg-dark text-white">
            <h5 class="mb-0">Zone de combat</h5>
          </div>
        </div>
      </div>
    </div>
    
    <div class="text-center mt-4">
      <button class="btn btn-danger btn-lg" @click="quitGame">
        Abandonner la mission
      </button>
    </div>
    
    <div v-if="showConfirmation" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
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