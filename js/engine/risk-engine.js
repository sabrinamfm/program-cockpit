function calculateRiskAge(risk, availableSnapshots) {
    if (!risk.introduced) {
        return null;
    }

    const introducedIndex = availableSnapshots.indexOf(risk.introduced);

    if (introducedIndex === -1) {
        return null;
    }

    return (availableSnapshots.length - introducedIndex);
}

function validateRisks(currentRisks, previousRisks, attentionQueue, availableSnapshots) {
    const warnings = [];
    const allowedRiskStates = uiConfig.riskStates || [];

    currentRisks.forEach((risk) => {
        if (risk.state && !allowedRiskStates.includes(risk.state)) {
            warnings.push({
                severity: "High",
                category: "Risk State",
                message: `Invalid risk state: ${risk.state}`
            });
        }
    });

    const currentTitles = currentRisks.map((risk) => risk.title);

    previousRisks.forEach((risk) => {
        if (!currentTitles.includes(risk.title)) {
            warnings.push({
                severity: "High",
                category: "Risk Continuity",
                message: `Risk missing from current snapshot: ${risk.title}`
            });
        }
    });

    const attentionTitles = attentionQueue.map((item) => item.title);

    currentRisks.forEach((risk) => {
        const riskAge = calculateRiskAge(risk, availableSnapshots);
        const requiresAttention = riskAge >= 3 && risk.state === "Unresolved";
        const alreadyTracked = attentionTitles.includes(risk.title);

        if (requiresAttention && !alreadyTracked) {
            warnings.push({
                severity: "Medium",
                category: "Governance Attention",
                message: `Risk unresolved for ${riskAge} snapshots but not present in Attention Queue: ${risk.title}`
            });
        }
    });
    return warnings;
}