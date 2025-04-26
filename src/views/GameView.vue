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
const currentMission = ref(1);
const showVictoryModal = ref(false);
const showDefeatModal = ref(false);
const showNextMissionModal = ref(false);
const showRepairModal = ref(false);

const playerName = ref(playerNameState.value);
const playerExperience = ref('Maitre');
const playerCredits = ref(0);
const playerShipName = ref(shipNameState.value);
const playerHealth = ref(100);

const currentEnemy = ref<Enemy | null>(null);

function getHitProbability(experience: string | number): number {
  if (typeof experience === 'string') {
    switch (experience) {
      case 'Débutant': return 0.2;
      case 'Confirmé': return 0.35;
      case 'Expert': return 0.5;
      case 'Maitre': return 0.7;
      default: return 0.2;
    }
  } else {
    switch (experience) {
      case 1: return 0.2;
      case 2: return 0.35;
      case 3: return 0.5;
      case 4: return 0.7;
      default: return 0.2;
    }
  }
}

function getRandomDamage(): number {
  return Math.floor(Math.random() * 4) + 3;
}

async function fetchRandomEnemy() {
  const response = await fetch(`http://127.0.0.1:3000/characters`);
  const data = await response.json();
  
  const totalChars = data.length;
  const randomIndex = Math.floor(Math.random() * totalChars);
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
  if (!currentEnemy.value) return;
  
  const playerHitProb = getHitProbability('Maitre');
  const enemyHitProb = getHitProbability(currentEnemy.value.experience);
  
  const playerHits = Math.random() < playerHitProb;
  const enemyHits = Math.random() < enemyHitProb;
  
  if (playerHits) {
    const damage = getRandomDamage();
    currentEnemy.value.health = Math.max(0, currentEnemy.value.health - damage);
  }
  
  if (enemyHits) {
    const damage = getRandomDamage();
    playerHealth.value = Math.max(0, playerHealth.value - damage);
  }
  if (playerHealth.value <= 0) {
    showDefeatModal.value = true;
  } 

  else if (currentEnemy.value.health <= 0) {
    const creditsWon = currentEnemy.value.credits;
    playerCredits.value += creditsWon;
    showVictoryModal.value = true;
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

function skipMission() {
  if (currentMission.value < 5) {
    currentMission.value++;
    fetchRandomEnemy();
  } else {
    gameWon();
  }
}

function confirmNextMission() {
  showNextMissionModal.value = false;
  currentMission.value++;
  fetchRandomEnemy();
}

function openRepairModal() {
  showRepairModal.value = true;
}

function repairShip() {
  const coutParPourcent = 5;
  const pointsDeVieManquants = 100 - playerHealth.value;
  const pourcentReparable = Math.floor(playerCredits.value / coutParPourcent);

  if (pourcentReparable > 0) {
    const pourcentAReparer = Math.min(pourcentReparable, pointsDeVieManquants);

    playerHealth.value += pourcentAReparer;
    playerCredits.value -= pourcentAReparer * coutParPourcent;
  }

  showRepairModal.value = false;
  currentMission.value++;
  fetchRandomEnemy();
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
  <button 
    class="btn btn-danger" 
    @click="attack" 
    :disabled="!currentEnemy || currentEnemy.health <= 0 || playerHealth <= 0"
  >
    Attaquer
  </button>
  <button 
    class="btn btn-warning" 
    @click="openRepairModal"
    :disabled="playerHealth >= 100"
  >
    Réparer le vaisseau
  </button>
  <button 
    class="btn btn-secondary"
    @click="skipMission"
  >
    Passer la mission
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

    <div v-if="showNextMissionModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">Mission terminée</h5>
          </div>
          <div class="modal-body">
            <p>Mission {{ currentMission }}/5 terminée avec succès.</p>
            <p>État de votre vaisseau : {{ playerHealth }}%</p>
            <p>Que souhaitez-vous faire avant la prochaine mission ?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="confirmNextMission">OK</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showRepairModal" class="modal fade show d-block" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-warning text-dark">
        <h5 class="modal-title">Réparation du vaisseau</h5>
      </div>
      <div class="modal-body">
        <p>Coût de réparation : 5 CG par % de vie</p>
        <p>Points de vie manquants : {{ 100 - playerHealth }}%</p>
        <p>Crédits disponibles : {{ playerCredits }} CG</p>
        <p>
          Vous pourrez réparer <strong>{{ Math.floor(playerCredits / 5) }}</strong>% de vie.
        </p>
      </div>
      <div class="modal-footer">
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="showRepairModal = false"
        >
          OK
        </button>
        <button 
          type="button" 
          class="btn btn-success" 
          @click="repairShip"
          :disabled="playerCredits < 5"
        >
          Réparer et continuer
        </button>
      </div>
    </div>
  </div>
</div>
  </div>
</template>