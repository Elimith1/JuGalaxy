<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const showConfirmation = ref(false);
const pendingRoute = ref('');

const isInGame = () => {
  return sessionStorage.getItem('gameActive') === 'true';
};

const navigate = (path: string) => {
  if (isInGame()) {
    pendingRoute.value = path;
    showConfirmation.value = true;
  } else {
    router.push(path);
  }
};

const confirmNavigation = () => {
  showConfirmation.value = false;
  if (pendingRoute.value) {
    router.push(pendingRoute.value);
    pendingRoute.value = '';
  }
};

const cancelNavigation = () => {
  showConfirmation.value = false;
  pendingRoute.value = '';
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="#" @click.prevent="navigate('/')">JuGalaxy</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item me-2">
            <button class="btn btn-primary" @click="navigate('/')">
              Accueil
            </button>
          </li>
          <li class="nav-item">
            <button class="btn btn-primary" @click="navigate('/ranking')">
              Classement
            </button>
          </li>
        </ul>
      </div>
    </div>
    
    <div class="modal" :class="{ 'd-block': showConfirmation }" tabindex="-1" v-if="showConfirmation">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Attention</h5>
            <button type="button" class="btn-close" @click="cancelNavigation"></button>
          </div>
          <div class="modal-body">
            <p>Si vous quittez maintenant, vous perdrez votre partie en cours. Êtes-vous sûr de vouloir continuer ?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelNavigation">Annuler</button>
            <button type="button" class="btn btn-danger" @click="confirmNavigation">Quitter</button>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
  </nav>
</template>