<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Enemy } from '../types/types.ts';
import { playerNameState, shipNameState } from '../types/types';
import EnemyStats from '../components/EnemyStats.vue';

const props = defineProps<{
  isGameActive: boolean
}>();

const emit = defineEmits<{
  (e: 'setGameActive', value: boolean): void
}>();

const router = useRouter();

const showConfirmation = ref(false);
const currentMission = ref(1);

const playerName = ref(playerNameState.value);
const playerExperience = ref('Maitre');
const playerCredits = ref(0);
const playerShipName = ref(shipNameState.value);
const playerHealth = ref(100);

const currentEnemy = ref<Enemy | null>(null);

// J'ai demander beaucoup d'aide à mon ami ChatGPT pour m'aider avec la fonction.
async function fetchRandomEnemy() {
  const response = await fetch(`http://127.0.0.1:3000/characters`);
  const characters = await response.json();
  
  const randomIndex = Math.floor(Math.random() * characters.length);
  const character = characters[randomIndex];
  
  currentEnemy.value = {
    id: character.id,
    name: character.name,
    experience: character.experience,
    credits: character.credit,
    shipName: character.ship.name,
    health: 100
  };
}

onMounted(() => {
  emit('setGameActive', true);
  fetchRandomEnemy();
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
              <p class="text-primary fw-bold">{{ playerName }}</p>
            </div>
            <div class="mb-3">
              <h6>Expérience:</h6>
              <p class="text-success">{{ playerExperience }}</p>
            </div>
            <div class="mb-3">
              <h6>Crédits Galactiques:</h6>
              <p class="text-warning fw-bold">{{ playerCredits }} CG</p>
            </div>
            <div class="mb-3">
              <h6>Vaisseau:</h6>
              <p>{{ playerShipName }}</p>
            </div>
            <div>
              <h6>Vie du vaisseau:</h6>
              <div class="progress">
                <div 
                  class="progress-bar" 
                  role="progressbar" 
                  :style="{ width: playerHealth + '%' }"
                  :class="{
                    'bg-success': playerHealth > 60,
                    'bg-warning': playerHealth > 30 && playerHealth <= 60,
                    'bg-danger': playerHealth <= 30
                  }"
                >
                  {{ playerHealth }}%
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
        <div class="card shadow mb-4">
          <div class="card-header bg-dark text-white">
            <h5 class="mb-0">Zone de combat</h5>
          </div>
          <div class="card-body">
            <EnemyStats :enemy="currentEnemy" />
            
            <div class="d-flex justify-content-center gap-3 mt-3">
              <button class="btn btn-danger">Attaquer</button>
            </div>
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