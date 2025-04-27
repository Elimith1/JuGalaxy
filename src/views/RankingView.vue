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

onMounted(async () => {
  rankingData.value = await fetchRanking();
  isLoading.value = false;
});

function returnToHome() {
  router.push('/');
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
        <!-- J'ai demander de l'aide a ChatGPT pour cette partie (Samuel) -->
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