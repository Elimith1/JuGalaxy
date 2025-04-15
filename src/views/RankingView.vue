<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchRanking, RankingItem } from '../services/api';

const router = useRouter();
const rankingData = ref<RankingItem[]>([]);
const isLoading = ref(true);
const error = ref('');
const debugInfo = ref('');

onMounted(async () => {
  try {
    console.log('Montage du composant RankingView, chargement des données...');
    rankingData.value = await fetchRanking();
    console.log('Données chargées avec succès:', rankingData.value);
    isLoading.value = false;
  } catch (err) {
    console.error('Erreur lors du chargement:', err);
    error.value = "Erreur lors du chargement du classement. Détails dans la console.";
    isLoading.value = false;
    
    if (err instanceof Error) {
      debugInfo.value = err.message;
    } else {
      debugInfo.value = String(err);
    }
  }
});

function returnToHome() {
  const isInGame = sessionStorage.getItem('gameActive') === 'true';
  
  if (isInGame) {
    if (confirm('Quitter la partie en cours? Votre progression sera perdue.')) {
      router.push('/');
    }
  } else {
    router.push('/');
  }
}

function retryLoading() {
  isLoading.value = true;
  error.value = '';
  debugInfo.value = '';
  
  fetchRanking()
    .then(data => {
      rankingData.value = data;
      isLoading.value = false;
    })
    .catch(err => {
      error.value = "Erreur lors du chargement du classement";
      isLoading.value = false;
      console.error(err);
      
      if (err instanceof Error) {
        debugInfo.value = err.message;
      } else {
        debugInfo.value = String(err);
      }
    });
}

function loadStaticData() {
  isLoading.value = true;
  error.value = '';
  // temporairement regarder trello
  const staticData = [
    { id: 1, name: "Yan Maz Solo", score: 500 },
    { id: 2, name: "Jym'Gil the Hutt", score: 495 },
    { id: 3, name: "Kath'rine Tanoor", score: 490 }
  ];
  
  setTimeout(() => {
    rankingData.value = staticData;
    isLoading.value = false;
  }, 300);
}
</script>

<template>
  <div class="container py-5">
    <h1 class="text-center mb-4">Tableau des Scores</h1>
    
    <div v-if="isLoading" class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <p>{{ error }}</p>
      <p v-if="debugInfo" class="small mt-2 text-muted">Détails techniques: {{ debugInfo }}</p>
      <div class="mt-3">
        <button @click="retryLoading" class="btn btn-sm btn-danger me-2">
          Réessayer avec l'API
        </button>
        <button @click="loadStaticData" class="btn btn-sm btn-secondary">
          Charger les données statiques
        </button>
      </div>
    </div>
    
    <div v-else>
      <div v-if="rankingData.length === 0" class="alert alert-info text-center">
        Aucun score enregistré pour le moment.
      </div>
      
      <div v-else class="table-responsive">
        <table class="table table-striped">
          <thead class="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nom</th>
              <th scope="col" class="text-end">Score (CG)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, index) in rankingData" :key="player.id" 
                :class="{'table-warning': index === 0, 'table-secondary': index === 1 || index === 2}">
              <td>{{ index + 1 }}</td>
              <td>{{ player.name }}</td>
              <td class="text-end fw-bold">{{ player.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="text-center mt-4">
      <button class="btn btn-primary" @click="returnToHome">
        Retour à l'accueil
      </button>
    </div>
  </div>
</template>