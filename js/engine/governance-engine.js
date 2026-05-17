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

    (currentMilestones || []).forEach(
        (currentMilestone) => {
            const previousMilestone = (previousMilestones || []).find(
                (milestone) => {
                    if (currentMilestone.id && milestone.id) {
                        return milestone.id === currentMilestone.id;
                    }

                    return milestone.title === currentMilestone.title;
                }
            );

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
    return (risks || []).filter((risk) => risk.state !== "Closed").length;
}

function calculatePendingDecisions(decisions) {
    return (decisions || []).length;
}

function parseSnapshotIdToTimestamp(snapshotId) {
    if (typeof snapshotId !== "string") {
        return null;
    }

    const match = snapshotId.match(/^(\d{4}-\d{2}-\d{2})/);
    if (!match) {
        return null;
    }

    const date = new Date(match[1]);
    return Number.isNaN(date.getTime()) ? null : date.getTime();
}

function getAttentionQueuePriority(queueLevel) {
    const configuredLevels = ((typeof uiConfig !== "undefined" && Array.isArray(uiConfig.queueLevels)) ? uiConfig.queueLevels : []);
    const orderedLevels = configuredLevels.length > 0 ? [...configuredLevels].reverse() : ["Urgent", "Review", "Informational"];
    const index = orderedLevels.indexOf(queueLevel);
    return index !== -1 ? index : orderedLevels.length;
}

function getAttentionAgeSortKey(item, entity) {
    if (typeof item.age === "number") {
        return -item.age;
    }

    if (item.createdAt) {
        const createdTs = Date.parse(item.createdAt);
        if (!Number.isNaN(createdTs)) {
            return createdTs;
        }
    }

    if (entity && typeof entity.introduced === "string") {
        const introducedTs = parseSnapshotIdToTimestamp(entity.introduced);
        if (introducedTs !== null) {
            return introducedTs;
        }
    }

    if (entity && entity.lastUpdated) {
        const updatedTs = Date.parse(entity.lastUpdated);
        if (!Number.isNaN(updatedTs)) {
            return updatedTs;
        }
    }

    return Number.MAX_SAFE_INTEGER;
}

function resolveAttentionEntities(snapshot) {
    return (snapshot.attentionQueue || [])
        .map((item, index) => {
            let referencedEntity = null;

            switch (item.entityType) {
                case "Risk":
                    referencedEntity = snapshot.risks.find(
                        (risk) => risk.id === item.entityId
                    );
                    break;

                case "Milestone":
                    referencedEntity = snapshot.milestones.find(
                        (milestone) => milestone.id === item.entityId
                    );
                    break;

                case "Decision":
                    referencedEntity = snapshot.decisions.find(
                        (decision) => decision.id === item.entityId
                    );
                    break;

                case "Dependency":
                    referencedEntity = snapshot.dependencies?.find(
                        (dependency) => dependency.id === item.entityId
                    );
                    break;
            }

            if (!referencedEntity) {
                return null;
            }

            return {
                entityType: item.entityType,
                entityId: item.entityId,
                queueLevel: item.queueLevel,
                reason: item.reason,
                owner: item.owner,
                entity: referencedEntity,
                _attentionPriority: getAttentionQueuePriority(item.queueLevel),
                _attentionAgeKey: getAttentionAgeSortKey(item, referencedEntity),
                _originalIndex: index
            };
        })
        .filter(Boolean)
        .sort((a, b) => {
            if (a._attentionPriority !== b._attentionPriority) {
                return a._attentionPriority - b._attentionPriority;
            }

            if (a._attentionAgeKey !== b._attentionAgeKey) {
                return a._attentionAgeKey - b._attentionAgeKey;
            }

            return a._originalIndex - b._originalIndex;
        })
        .map(({ _attentionPriority, _attentionAgeKey, _originalIndex, ...rest }) => rest);
}

function calculateBlockedDependencies(dependencies) {
    return (dependencies || []).filter((dependency) => dependency.status === "Blocked").length;
}

function validateDependencyHealth(dependencies) {
    const warnings = [];

    (dependencies || []).forEach(
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

function validateAttentionQueueReferences(attentionQueue, snapshot) {
    const warnings = [];
    const attentionEntityTypeMap = {
        Risk: "risks",
        Dependency: "dependencies",
        Milestone: "milestones",
        Decision: "decisions",
        Feature: "features",
        OKR: "okrs"
    };

    (attentionQueue || []).forEach(
        (item) => {
            const collectionKey = attentionEntityTypeMap[item.entityType];
            const entity = collectionKey
                ? findEntityById(
                    collectionKey,
                    item.entityId,
                    snapshot
                )
                : null;

            if (!entity) {
                warnings.push({
                    severity: "High",
                    category: "Topology",
                    message:`Attention Queue references missing entity: ${item.entityId}`
                });
            }
        }
    );

    return warnings;
}

function detectOperationalContradictions(currentSnapshot = {}, previousSnapshot = {}) {
    const warnings = [];
    const confidenceIncreased = currentSnapshot.declaredDeliveryConfidence > previousSnapshot.declaredDeliveryConfidence;
    const currentActiveRisks = calculateActiveRisks(currentSnapshot.risks);
    const previousActiveRisks = calculateActiveRisks(previousSnapshot.risks);
    const unresolvedRisksIncreased = currentActiveRisks > previousActiveRisks;

    if (confidenceIncreased && unresolvedRisksIncreased) {
        warnings.push({
            severity: "High",
            category: "Operational Contradiction",
            message: "Delivery confidence increased while unresolved risks increased"
        });
    }

    return warnings;
}

// Expose pure helpers for unit tests
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        detectConfidenceTrend,
        detectMilestoneDrift,
        calculateActiveRisks,
        calculateBlockedDependencies,
        resolveAttentionEntities,
        detectOperationalContradictions
    };
}

function collectGovernanceWarnings(currentSnapshot, previousSnapshot, availableSnapshots = [], historicalSnapshots = []) {
    const confidenceTrendWarning = detectConfidenceTrend(historicalSnapshots || []);

    return [
        ...(confidenceTrendWarning ? [confidenceTrendWarning] : []),

        ...detectMilestoneDrift(
            currentSnapshot.milestones || [],
            previousSnapshot.milestones || []
        ),

        ...validateProgramSnapshot(
            currentSnapshot
        ),

        ...validateSnapshotUniqueness(
            currentSnapshot
        ),

        ...validateRelationshipReferences(
            currentSnapshot
        ),

        ...validateRisksSchema(
            currentSnapshot.risks || []
        ),

        ...validateRisks(
            currentSnapshot.risks || [],
            previousSnapshot.risks || [],
            currentSnapshot.attentionQueue || [],
            availableSnapshots
        ),

        ...validateDependenciesSchema(
            currentSnapshot.dependencies || []
        ),

        ...validateFeaturesSchema(
            currentSnapshot.features || []
        ),

        ...validateMilestonesSchema(
            currentSnapshot.milestones || []
        ),

        ...validateDecisionsSchema(
            currentSnapshot.decisions || []
        ),

        ...validateAttentionsSchema(
            currentSnapshot.attentionQueue || []
        ),

        ...validateAttentionQueueReferences(
            currentSnapshot.attentionQueue,
            currentSnapshot
        ),

        ...validateDependencyHealth(
            currentSnapshot.dependencies
        ),

        ...detectOperationalContradictions(
            currentSnapshot,
            previousSnapshot
        )
    ];
}
