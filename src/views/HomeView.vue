<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

defineProps<{
  isGameActive: boolean
}>();

const emit = defineEmits<{
  (e: 'setGameActive', value: boolean): void
}>();

const playerName = ref('');
const selectedShip = ref('');
const errorMessage = ref('');

const availableShips = ref([
  { id: 20, name: "Millennium Falcon" },
  { id: 8378, name: "Y-wing" },
  { id: 4505, name: "X-wing" },
  { id: 1124, name: "TIE Advanced x1" },
  { id: 9030, name: "Executor" }
]);

const router = useRouter();

onMounted(() => {
  emit('setGameActive', false);
});

const startGame = () => {
  if (!playerName.value) {
    errorMessage.value = "Veuillez entrer un nom de personnage";
    return;
  }
  
  if (!selectedShip.value) {
    errorMessage.value = "Veuillez sélectionner un vaisseau";
    return;
  }
  
  router.push('/game');
};
</script>

<template>
  <div class="container py-5 text-center">
    <h1 class="display-4 mb-3">Bienvenue dans JuGalaxy</h1>
    <p class="lead mb-5">Survivez à cinq missions et amassez un maximum de crédits galactiques.</p>
    
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4">Nouvelle partie</h2>
            
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>
            
            <div class="mb-3">
              <label for="playerName" class="form-label">Nom du personnage:</label>
              <input 
                type="text" 
                id="playerName" 
                v-model="playerName" 
                class="form-control"
                placeholder="Entrez le nom de votre personnage"
                required
              >
            </div>
            
            <div class="mb-4">
              <label for="shipSelect" class="form-label">Vaisseau:</label>
              <select id="shipSelect" v-model="selectedShip" class="form-select" required>
                <option value="" disabled>Sélectionnez un vaisseau</option>
                <option v-for="ship in availableShips" :key="ship.id" :value="ship.id">
                  {{ ship.name }}
                </option>
              </select>
            </div>
            
            <button class="btn btn-primary w-100" @click="startGame">Commencer la partie</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>