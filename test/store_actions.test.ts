const { useGameStore } = require('../src/store/gameStore');
const { jobCatalog } = require('../src/engine/jobCatalog');
const { vehicleCatalog } = require('../src/engine/gameLogic');

(async () => {
  console.log('=== STORE ACTIONS TEST ===');
  const store = useGameStore.getState();
  // reset
  store.resetGame();

  // 1) Apply for job test
  console.log('-- Apply for job test --');
  const jobId = jobCatalog[1].id; // job_mid_dev - salary 4200
  const res = store.applyForJob(jobId);
  console.log('Apply result:', res);
  const afterApply = useGameStore.getState();
  console.log('Income after apply:', afterApply.playerStats.income);
  console.log('Job title after apply:', afterApply.playerStats.jobMetrics?.currentJobTitle);

  // Validate
  if (!res.success) {
    console.error('❌ Apply for job test failed:', res.message);
    process.exit(1);
  }
  if (afterApply.playerStats.income !== jobCatalog[1].salary) {
    console.error('❌ Income did not update correctly');
    process.exit(1);
  }

  console.log('✅ Apply for job test passed');

  // 2) Vehicle purchase test
  console.log('-- Vehicle purchase test --');
  const vehicle = vehicleCatalog.find((v: any) => v.tier === 2); // reliable camry
  if (!vehicle) {
    console.error('❌ No vehicle found for test');
    process.exit(1);
  }
  // Provide enough balance
  useGameStore.setState((state: any) => ({ playerStats: { ...state.playerStats, balanceDebit: 200000 } }));
  const purchaseRes = useGameStore.getState().purchaseVehicle(vehicle.id, 'cash');
  console.log('Purchase result:', purchaseRes);
  const afterPurchase = useGameStore.getState();
  console.log('Current Vehicle:', afterPurchase.playerStats.currentVehicle);

  if (!purchaseRes.success || !afterPurchase.playerStats.currentVehicle) {
    console.error('❌ Vehicle purchase test failed');
    process.exit(1);
  }
  console.log('✅ Vehicle purchase test passed');

  // 3) Housing purchase test
  console.log('-- Housing purchase test --');
  // Use the first buyable housing
  const housingList = (await import('../src/engine/gameLogic')).housingCatalog;
  const buyable = housingList.find(h => h.purchasePrice);
  if (!buyable) {
    console.log('⚠️ No buyable housing found; skipping housing purchase test');
  } else {
    // Ensure enough funds
    useGameStore.setState((state: any) => ({ playerStats: { ...state.playerStats, balanceDebit: 400000 } }));
    const hRes = useGameStore.getState().purchaseHousing(buyable.id, 'cash');
    console.log('Housing purchase result:', hRes);
    const afterHousing = useGameStore.getState();
    console.log('Current Housing:', afterHousing.playerStats.currentHousing);
    if (!hRes.success) {
      console.error('❌ Housing purchase failed:', hRes.message);
      process.exit(1);
    }
    console.log('✅ Housing purchase test passed');
  }

  console.log('All tests passed ✅');
  process.exit(0);
})();
