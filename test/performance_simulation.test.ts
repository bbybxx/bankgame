const { monthlyJobReview, triggerSalaryCutEvent, triggerLayoffEvent } = require('../src/engine/gameLogic');

(async () => {
  console.log('=== PERFORMANCE SIMULATION (engine-only) ===');

  const jobCatalog = require('../src/engine/jobCatalog').jobCatalog;
  const job = jobCatalog.find((j: any) => j.id === 'job_mid_dev');
  if (!job) {
    console.error('Job not found');
    process.exit(1);
  }

  // Build a minimal simulated playerStats that triggers repeated salary cuts (bad perf but not immediate layoff)
  let playerStats: any = {
    income: job.salary,
    happiness: 45, // poor but not disastrous
    stress: 60,    // moderate stress
    prospects: 30,
    creditScore: 700,
    jobMetrics: {
      currentPerformance: 50,
      monthlyPerformanceHistory: [50],
      monthsAtCurrentJob: 1,
      promotionEligibility: 0,
      riskOfLayoff: 10,
      lastReviewDate: new Date(),
      currentJobTitle: job.title,
    },
    investments: [],
    loans: [],
  };

  console.log('Starting income:', playerStats.income);

  for (let i = 0; i < 40; i++) {
    monthlyJobReview(playerStats);
    console.log(`Month ${i + 1}: income=${playerStats.income}, perf=${playerStats.jobMetrics.currentPerformance}, monthsAt=${playerStats.jobMetrics.monthsAtCurrentJob}`);
    if (playerStats.jobMetrics.currentPerformance === 0 && playerStats.jobMetrics.monthsAtCurrentJob === 0) {
      console.log('Laid off at month ', i + 1);
      break;
    }
  }

  console.log('Simulation ended');
  process.exit(0);
})();
