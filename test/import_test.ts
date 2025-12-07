import { useGameStore } from '../src/store/gameStore';
console.log('GameStore loaded', typeof useGameStore.getState === 'function');
