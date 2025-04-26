import { ref } from 'vue';

export interface Ship {
  id: number;
  name: string;
}

export interface PlayerCharacter {
  name: string;
  experience: string;
  credits: number;
  shipName: string;
  health: number;
}

export interface GameState {
  playerName: string;
  shipName: string;
}

export const playerNameState = ref('');
export const shipNameState = ref('');

export interface Enemy {
  id: number;
  name: string;
  experience: number;
  credits: number;
  shipName: string;
  health: number;
}


