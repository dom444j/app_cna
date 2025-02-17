const UNILEVEL_PLAN = {
    activationThresholds: [
        { id: 1, name: "BD1", minPoints: 50, maxPoints: 249, basePoints: 100 },
        { id: 2, name: "BD2", minPoints: 250, maxPoints: 499, basePoints: 250 },
        { id: 3, name: "BD3", minPoints: 500, maxPoints: Infinity, basePoints: 500 }
    ],
    levelPercentages: [
        { level: 1, BD1: 0.30, BD2: 0.30, BD3: 0.30 },
        { level: 2, BD1: 0.04, BD2: 0.04, BD3: 0.04 },
        { level: 3, BD1: 0.04, BD2: 0.04, BD3: 0.04 },
        { level: 4, BD1: 0.04, BD2: 0.04, BD3: 0.04 },
        { level: 5, BD1: 0.08, BD2: 0.08, BD3: 0.08 },
        { level: 6, BD1: 0.02, BD2: 0.02, BD3: 0.02 },
        { level: 7, BD1: 0.02, BD2: 0.02, BD3: 0.02 },
        { level: 8, BD1: 0.02, BD2: 0.02, BD3: 0.02 },
        { level: 9, BD1: 0.02, BD2: 0.02, BD3: 0.02 },
        { level: 10, BD1: 0.08, BD2: 0.08, BD3: 0.08 }
    ],
    successBonus: [
        { activation: "BD1", percentage: 0.10 },
        { activation: "BD2", percentage: 0.20 },
        { activation: "BD3", percentage: 0.30 }
    ],
    globalBonus: [
        { rank: "diamante ejecutivo", percentage: 0.02 },
        { rank: "diamante premier", percentage: 0.01 },
        { rank: "diamante royal", percentage: 0.02 }
    ]
};

module.exports = UNILEVEL_PLAN;

