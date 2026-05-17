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
    const currentRiskList = currentRisks || [];

    const currentTitles = currentRiskList.map((risk) => risk.title);

    (previousRisks || []).forEach((risk) => {
        if (!currentTitles.includes(risk.title)) {
            warnings.push({
                severity: "High",
                category: "Risk Continuity",
                message: `Risk missing from current snapshot: ${risk.title}`
            });
        }
    });

    currentRiskList.forEach((risk) => {
        const riskAge = calculateRiskAge(risk, availableSnapshots);
        const requiresAttention = riskAge >= 3 && risk.state === "Unresolved";
        const alreadyTracked = (attentionQueue || []).some(
            (item) => item.entityType === "Risk" && item.entityId === risk.id
        );

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

// Expose for Node unit tests
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        calculateRiskAge,
        validateRisks
    };
}
