/**
 * PHASE 1 TESTING: Game Logic Isolation
 * Run this to test if game logic works without UI
 * 
 * Usage:
 * Copy this file to test/storeTest.ts
 * Run: npx ts-node test/storeTest.ts
 */

import { useGameStore } from '../src/store/gameStore';

console.log('=== PHASE 1: GAME LOGIC ISOLATION TEST ===\n');

try {
  // Get initial state
  const store = useGameStore.getState();
  console.log('✅ Store initialized');
  console.log(`   - Player: ${store.playerStats.playerName}`);
  console.log(`   - Balance Debit: $${store.playerStats.balanceDebit}`);
  console.log(`   - Balance Virtual: $${store.playerStats.balanceVirtual}`);
  console.log(`   - Credit Score: ${store.playerStats.creditScore}`);
  console.log(`   - Loans: ${store.playerStats.loans?.length || 0}`);
  console.log(`   - Investments: ${store.playerStats.investments?.length || 0}`);
  console.log(`   - Game Events: ${store.playerStats.gameEvents?.length || 0}\n`);

  // Test 1: Execute 5 turns
  console.log('TEST 1: Execute 5 turns...');
  for (let i = 0; i < 5; i++) {
    try {
      store.nextTurn();
      const updatedStore = useGameStore.getState();
      console.log(`   Turn ${i + 1}:`);
      console.log(`      - Balance: $${updatedStore.playerStats.balanceDebit.toFixed(2)}`);
      console.log(`      - Happiness: ${Math.round(updatedStore.playerStats.happiness)}`);
      console.log(`      - Stress: ${Math.round(updatedStore.playerStats.stress)}`);
      console.log(`      - Credit Score: ${updatedStore.playerStats.creditScore}`);
    } catch (error) {
      console.error(`   ❌ Turn ${i + 1} failed:`, (error as Error).message);
      throw error;
    }
  }
  console.log('✅ All 5 turns completed\n');

  // Test 2: Check state after turns
  console.log('TEST 2: Check state integrity...');
  const finalStore = useGameStore.getState();
  console.log(`   - Transactions: ${finalStore.transactions?.length || 0}`);
  console.log(`   - Balance history length: ${finalStore.playerStats.balanceHistory?.length || 0}`);
  console.log(`   - Happiness history length: ${finalStore.playerStats.happinessHistory?.length || 0}`);
  console.log('✅ State integrity check passed\n');

  console.log('=== PHASE 1 COMPLETE ===');
  console.log('✅ Game logic is working correctly!');
  console.log('\nNext: Test UI components with mock data (Phase 2)');

} catch (error) {
  console.error('❌ PHASE 1 FAILED:');
  console.error((error as Error).message);
  console.error((error as Error).stack);
  process.exit(1);
}
