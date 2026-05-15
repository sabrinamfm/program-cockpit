function renderGovernanceWarnings(warnings) {
    const container = document.getElementById("governance-warnings-container");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (warnings.length === 0) {
        return;
    }

    warnings.forEach((warning) => {
        container.innerHTML += `
            <div class="governance-warning ${warning.severity.toLowerCase()}">
                <div class="governance-warning-header">
                    <span class="governance-severity">
                        ${warning.severity}
                    </span>

                    <span class="governance-category">
                        ${warning.category}
                    </span>
                </div>
                <div class="governance-message">
                    ${warning.message}
                </div>
            </div>
        `;
    });
}

function detectOperationalContradictions(currentSnapshot, previousSnapshot) {
    const warnings = [];
    const confidenceIncreased = currentSnapshot.deliveryConfidence > previousSnapshot.deliveryConfidence;
    const unresolvedRisksIncreased = currentSnapshot.activeRisks > previousSnapshot.activeRisks;

    if (confidenceIncreased && unresolvedRisksIncreased) {
        warnings.push({
            severity: "High",
            category: "Operational Contradiction",
            message: "Delivery confidence increased while unresolved risks increased"
        });
    }

    return warnings;
}