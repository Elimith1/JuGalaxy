<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Enemy } from '../types/types.ts';
import { playerNameState, shipNameState } from '../types/types';
import EnemyStats from '../components/EnemyStats.vue';
import { addPlayerToRanking } from '../services/api';

const props = defineProps<{
  isGameActive: boolean
}>();

const emit = defineEmits<{
  (e: 'setGameActive', value: boolean): void
}>();

const router = useRouter();


const showConfirmation = ref(false);
const showVictoryModal = ref(false);
const showDefeatModal = ref(false);
const showRepairModal = ref(false);

const currentMission = ref(1); 
const playerName = ref(playerNameState.value);
const playerExperience = ref('Maitre');
const playerCredits = ref(0);
const playerShipName = ref(shipNameState.value);
const playerHealth = ref(100);
const currentEnemy = ref<Enemy | null>(null); 

// J'ai demander de l'aide a ChatGPT pour cette partie (Samuel)
function getHitProbability(experience: string | number): number {
  if (typeof experience === 'string') {
    if (experience === 'Débutant') return 0.2;
    if (experience === 'Confirmé') return 0.35;
    if (experience === 'Expert') return 0.5;
    if (experience === 'Maitre') return 0.7;
    return 0.2;
  } else {
    if (experience === 1) return 0.2;
    if (experience === 2) return 0.35;
    if (experience === 3) return 0.5;
    if (experience === 4) return 0.7;
    return 0.2;
  }
}

function getRandomDamage(): number {
  return Math.floor(Math.random() * 4) + 3;
}

// J'ai demander de l'aide a ChatGPT pour cette fonction (Mathieu)
async function fetchRandomEnemy() {
  const response = await fetch(`http://127.0.0.1:3000/characters`);
  const data = await response.json();
  
  const randomIndex = Math.floor(Math.random() * data.length);
  const character = data[randomIndex];
  
  currentEnemy.value = {
    id: character.id,
    name: character.name,
    experience: character.experience,
    credits: character.credit,
    shipName: character.ship.name,
    health: 100
  };
}

function attack() {
  if (!currentEnemy.value) {
    return;
  }
  
  const playerHitProb = getHitProbability('Maitre');
  const enemyHitProb = getHitProbability(currentEnemy.value.experience);
  
  if (Math.random() < playerHitProb) {
    const damage = getRandomDamage();
    currentEnemy.value.health = Math.max(0, currentEnemy.value.health - damage);
  }
  
  if (Math.random() < enemyHitProb) {
    const damage = getRandomDamage();
    playerHealth.value = Math.max(0, playerHealth.value - damage);
  }
  
  if (playerHealth.value <= 0) {
    showDefeatModal.value = true;
  } 

  else if (currentEnemy.value.health <= 0) {
    playerCredits.value += currentEnemy.value.credits;
    showVictoryModal.value = true;
  }
}

function repairShip() {
  // J'ai demander de l'aide a ChatGPT pour cette partie car j'avais beaucoup de bug et meme stackoverflow aidait pas (Samuel)
  const repairCost = 5;
  const maxRepair = Math.floor(playerCredits.value / repairCost);
  const neededRepair = 100 - playerHealth.value;
  
  if (maxRepair > 0 && neededRepair > 0) {
    const repairAmount = Math.min(maxRepair, neededRepair);
    playerHealth.value += repairAmount;
    playerCredits.value -= repairAmount * repairCost;
  }
  
  showRepairModal.value = false;
  
  if (currentMission.value < 5) {
    currentMission.value++;
    fetchRandomEnemy();
  } else {
    gameWon();
  }
}

function nextMission() {
  showVictoryModal.value = false;
  
  if (currentMission.value < 5) {
    currentMission.value++;
    fetchRandomEnemy();
  } else {
    gameWon();
  }
}

async function gameWon() {
  await addPlayerToRanking(playerName.value, playerCredits.value);
  emit('setGameActive', false);
  router.push('/ranking');
}

function restartGame() {
  emit('setGameActive', false);
  router.push('/');
}

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

onMounted(() => {
  emit('setGameActive', true);
  fetchRandomEnemy();
});
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
                <!-- J'ai demander de l'aide a ChatGPT ici (pour la progress bar) (Mathieu) -->
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
              <!-- J'ai demander de l'aide a AppWebGPT pour ici (Samuel) -->
              <button 
                class="btn btn-danger" 
                @click="attack" 
                :disabled="!currentEnemy || currentEnemy.health <= 0 || playerHealth <= 0"
              >
                Attaquer
              </button>
              <button 
                class="btn btn-warning" 
                @click="showRepairModal = true"
                :disabled="playerHealth >= 100 || playerCredits < 5"
              >
                Réparer le vaisseau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-4">
      <button class="btn btn-danger btn-lg" @click="quitGame">
        Quitter la partie
      </button>
    </div>
    
    <!-- Demander un peu d'aide a ChatGPT pour comprendre comment faire le modal ensuite je me suis inspirer de celui-ci pour faires les autres (Samuel) -->
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

    <div v-if="showVictoryModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Victoire !</h5>
          </div>
          <div class="modal-body">
            <p>Vous avez vaincu {{ currentEnemy?.name }} et récupéré {{ currentEnemy?.credits }} crédits !</p>
            <p>Crédits totaux : {{ playerCredits }} CG</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="nextMission">Continuer</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDefeatModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">Défaite !</h5>
          </div>
          <div class="modal-body">
            <p>Votre vaisseau a été détruit par {{ currentEnemy?.name }}.</p>
            <p>Vous avez obtenu un total de {{ playerCredits }} crédits galactiques.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="restartGame">Retour à l'accueil</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showRepairModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title">Réparation du vaisseau</h5>
            <button type="button" class="btn-close" @click="showRepairModal = false"></button>
          </div>
          <div class="modal-body">
            <!-- Demander un peu d'aide a ChatGPT ici pour les calculs principalement -->
            <p>Réparer votre vaisseau terminera également la mission actuelle.</p>
            <p>Coût de réparation : 5 CG par % de vie</p>
            <p>Points de vie manquants : {{ 100 - playerHealth }}%</p>
            <p>Crédits disponibles : {{ playerCredits }} CG</p>
            <p>
              Maximum réparable : {{ Math.min(Math.floor(playerCredits / 5), 100 - playerHealth) }}%
            </p>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="showRepairModal = false"
            >
              Annuler
            </button>
            <button 
              type="button" 
              class="btn btn-success" 
              @click="repairShip"
              :disabled="playerCredits < 5 || playerHealth >= 100"
            >
              Réparer et continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>