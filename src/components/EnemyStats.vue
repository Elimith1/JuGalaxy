<script setup lang="ts">
import { type Enemy } from '../types/types';

const props = defineProps<{
  enemy: Enemy | null;
}>();

function getExperienceText(level: number): string {
  if (level === 1) {
    return 'Débutant';
  }
  
  if (level === 2) {
    return 'Confirmé';
  }
  
  if (level === 3) {
    return 'Expert';
  }
  
  if (level === 4) {
    return 'Maitre';
  }
  
  return 'Inconnu';
}
</script>

<template>
  <div class="card shadow mb-4" v-if="enemy">
    <div class="card-header bg-danger text-white">
      <h5 class="mb-0">Votre ennemi</h5>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <h6>Nom:</h6>
        <p class="text-primary fw-bold">{{ enemy.name }}</p>
      </div>
      <div class="mb-3">
        <h6>Expérience:</h6>
        <p class="text-success">{{ getExperienceText(enemy.experience) }}</p>
      </div>
      <div class="mb-3">
        <h6>Crédits Galactiques:</h6>
        <p class="text-warning fw-bold">{{ enemy.credits }} CG</p>
      </div>
      <div class="mb-3">
        <h6>Vaisseau:</h6>
        <p>{{ enemy.shipName }}</p>
      </div>
      <div>
        <h6>Vie du vaisseau:</h6>
        <div class="progress">
          <div 
            class="progress-bar" 
            role="progressbar" 
            :style="{ width: enemy.health + '%' }"
            :class="{
              'bg-success': enemy.health > 60,
              'bg-warning': enemy.health > 30 && enemy.health <= 60,
              'bg-danger': enemy.health <= 30
            }"
          >
            {{ enemy.health }}%
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card shadow mb-4" v-else>
    <div class="card-body text-center">
      <p>Aucun ennemi en vue...</p>
    </div>
  </div>
</template>