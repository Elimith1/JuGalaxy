<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchRanking } from '../services/api';
import type { RankingItem } from '../services/api'

const props = defineProps<{
  isGameActive: boolean
}>();

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
  if (props.isGameActive) {
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
</script>

<template>
  <div class="container py-5">
    <h1 class="text-center mb-4">Tableau des Scores</h1>      
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
    
    <div class="text-center mt-4">
      <button class="btn btn-primary" @click="returnToHome">
        Retour à l'accueil
      </button>
    </div>
</template>