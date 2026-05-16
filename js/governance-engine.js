function detectConfidenceTrend(snapshots) {
    if (snapshots.length < 3) {
        return null;
    }

    const lastThree = snapshots.slice(-3);

    const isDecreasing =
        lastThree[0]
            .declaredDeliveryConfidence >
        lastThree[1]
            .declaredDeliveryConfidence &&
        lastThree[1]
            .declaredDeliveryConfidence >
        lastThree[2]
            .declaredDeliveryConfidence;

    if (!isDecreasing) {
        return null;
    }

    return {
        severity: "High",
        category: "Delivery Trend",
        message: "Delivery confidence decreased for 3 consecutive snapshots"
    };
}

function detectMilestoneDrift(currentMilestones, previousMilestones) {
    const warnings = [];

    currentMilestones.forEach(
        (currentMilestone) => {
            const previousMilestone = previousMilestones.find((milestone) => milestone.title === currentMilestone.title);

            if (!previousMilestone) {
                return;
            }

            const previousDate = new Date(previousMilestone.date);
            const currentDate = new Date(currentMilestone.date);
            const differenceInMs = currentDate - previousDate;
            const differenceInDays = Math.round(differenceInMs / (1000 * 60 * 60 * 24));

            if (differenceInDays <= 0) {
                return;
            }

            warnings.push({
                severity: "Medium",
                category: "Milestone Drift",
                message: `${currentMilestone.title} slipped by ${differenceInDays} day(s)`
            });
        }
    );

    return warnings;
}

function calculateActiveRisks(risks) {
    return risks.filter((risk) => risk.state !== "Closed").length;
}

function calculatePendingDecisions(decisions) {
    return decisions.length;
}

function resolveAttentionEntities(snapshot) {
    return snapshot.attentionQueue
        .map((item) => {
            let referencedEntity =
                null;

            switch (item.entityType) {
                case "Risk":
                    referencedEntity =
                        snapshot.risks.find(
                            (risk) =>
                                risk.id ===
                                item.entityId
                        );
                    break;

                case "Milestone":
                    referencedEntity =
                        snapshot.milestones.find(
                            (milestone) =>
                                milestone.id ===
                                item.entityId
                        );
                    break;

                case "Decision":
                    referencedEntity =
                        snapshot.decisions.find(
                            (decision) =>
                                decision.id ===
                                item.entityId
                        );
                    break;

                case "Dependency":
                    referencedEntity =
                        snapshot.dependencies?.find(
                            (dependency) =>
                                dependency.id ===
                                item.entityId
                        );
                    break;
            }

            if (!referencedEntity) {
                return null;
            }

            return {
                entityType:
                    item.entityType,

                entityId:
                    item.entityId,

                priority:
                    item.priority,

                reason:
                    item.reason,

                entity:
                    referencedEntity
            };
        }
    ).filter(Boolean);
}

function calculateBlockedDependencies(dependencies) {
    return dependencies.filter((dependency) => dependency.status === "Blocked").length;
}

function validateDependencyHealth(dependencies) {
    const warnings = [];

    dependencies.forEach(
        (dependency) => {
            if (dependency.status === "Blocked") {
                warnings.push({
                    severity: "Medium",
                    category: "Dependency",
                    message: `Dependency blocked: ${dependency.title}`
                });
            }
        }
    );

    return warnings;
}