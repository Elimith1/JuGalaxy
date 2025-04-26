import { reactive } from 'vue';

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

export const gameState = reactive<GameState>({
    playerName: '',
    shipName: ''
  });
  