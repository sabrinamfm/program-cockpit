const ENTITY_ID_PATTERNS = {
    attentions:/^ATTN-\d+$/,
    risks:/^RISK-\d+$/,
    dependencies: /^DEP-\d+$/,
    milestones: /^MS-\d+$/,
    features: /^FEAT-\d+$/,
    decisions: /^DEC-\d+$/
};

function validateEntityIdFormat(entity, collectionName, entityType) {
    const pattern = ENTITY_ID_PATTERNS[collectionName];

    if (!pattern) {
        return [];
    }

    if (pattern.test(entity.id)) {
        return [];
    }

    return [{
        severity: "High",
        category: "Schema",
        message: `${entityType} has invalid ID format: ${entity.id}`
    }];
}

function validateEntity(entity, schema, entityType) {
    const warnings = [];

    schema.required.forEach(
        (field) => {
            if (entity[field] === undefined || entity[field] === null) {
                warnings.push({
                    severity: "High",
                    category: "Schema Validation",
                    message: `${entityType} missing required field: ${field}`
                });
            }
        }
    );

    return warnings;
}

function getConfiguredValues(key) {
    return ((typeof uiConfig !== "undefined" && Array.isArray(uiConfig[key])) ? uiConfig[key] : []) || [];
}

function getValueByPath(entity, path) {
    return path.split(".").reduce((value, segment) => value?.[segment], entity);
}

function getEntityLabel(entity) {
    if (entity?.id) {
        return ` ${entity.id}`;
    }

    if (entity?.title) {
        return ` ${entity.title}`;
    }

    return "";
}

function validateAllowedValue(entity, field, allowedValues, entityType) {
    const warnings = [];
    const value = getValueByPath(entity, field);

    if (!Array.isArray(allowedValues) || allowedValues.length === 0 || value === undefined || value === null || value === "") {
        return warnings;
    }

    if (!allowedValues.includes(value)) {
        warnings.push({
            severity: "High",
            category: "Schema Validation",
            message: `${entityType}${getEntityLabel(entity)} has invalid ${field}: ${value}`
        });
    }

    return warnings;
}

function validateProgramSnapshot(snapshot = {}) {
    const warnings = [
        ...validateAllowedValue(snapshot, "programStatus", getConfiguredValues("programStatuses"), "Program")
    ];

    (snapshot.relatedOKRs || []).forEach((okr) => {
        warnings.push(
            ...validateAllowedValue(okr, "status", getConfiguredValues("okrStatuses"), "OKR")
        );
    });

    return warnings;
}

function validateUniqueField(entities = [], field, entityType, severity = "Medium") {
    const warnings = [];
    const seen = new Map();

    (entities || []).forEach((entity) => {
        const value = entity?.[field];

        if (!value) {
            return;
        }

        if (seen.has(value)) {
            warnings.push({
                severity,
                category: "Schema Validation",
                message: `Duplicate ${entityType} ${field}: ${value}`
            });
            return;
        }

        seen.set(value, true);
    });

    return warnings;
}

function validateSnapshotUniqueness(snapshot = {}) {
    const entityGroups = [
        ["risks", "Risk"],
        ["dependencies", "Dependency"],
        ["milestones", "Milestone"],
        ["decisions", "Decision"],
        ["features", "Feature"],
        ["attentionQueue", "Attention"],
        ["relatedOKRs", "OKR"]
    ];

    return entityGroups.flatMap(([collectionKey, entityType]) => [
        ...validateUniqueField(snapshot[collectionKey] || [], "id", entityType, "High"),
        ...validateUniqueField(snapshot[collectionKey] || [], "title", entityType, "Medium")
    ]);
}

function getSnapshotCollectionMap(snapshot = {}) {
    return {
        risks: snapshot.risks || [],
        dependencies: snapshot.dependencies || [],
        milestones: snapshot.milestones || [],
        decisions: snapshot.decisions || [],
        okrs: snapshot.relatedOKRs || [],
        features: snapshot.features || []
    };
}

function validateRelationshipReferences(snapshot = {}) {
    const warnings = [];
    const collectionMap = getSnapshotCollectionMap(snapshot);
    const sourceGroups = [
        ["risks", "Risk"],
        ["dependencies", "Dependency"],
        ["milestones", "Milestone"],
        ["decisions", "Decision"],
        ["features", "Feature"]
    ];

    sourceGroups.forEach(([collectionKey, entityType]) => {
        (collectionMap[collectionKey] || []).forEach((entity) => {
            Object.entries(entity.relationships || {}).forEach(([relationshipType, ids]) => {
                if (!Array.isArray(ids) || !collectionMap[relationshipType]) {
                    return;
                }

                ids.forEach((id) => {
                    const targetExists = collectionMap[relationshipType].some((target) => target.id === id);

                    if (!targetExists) {
                        warnings.push({
                            severity: "High",
                            category: "Topology",
                            message: `${entityType}${getEntityLabel(entity)} references missing ${relationshipType} entity: ${id}`
                        });
                    }
                });
            });
        });
    });

    return warnings;
}

function validateAttentionsSchema(attentions = []) {
    return (attentions || []).flatMap((attention) => [
        ...validateEntity(attention, attentionSchema, "Attention"),
        ...validateEntityIdFormat(attention, "attention", "Attention"),
        ...validateAllowedValue(attention, "queueLevel", getConfiguredValues("queueLevels"), "Attention")
    ]);
}

function validateDecisionsSchema(decisions = []) {
    return (decisions || []).flatMap((decision) => [
        ...validateEntity(decision, decisionSchema, "Decision"),
        ...validateEntityIdFormat(decision, "decision", "Decision"),
        ...validateAllowedValue(decision, "status", getConfiguredValues("decisionStatuses"), "Decision"),
        ...validateAllowedValue(decision, "severity", getConfiguredValues("riskSeverityLevels"), "Decision")
    ]);
}

function validateMilestonesSchema(milestones = []) {
    return (milestones || []).flatMap((milestone) => [
        ...validateEntity(milestone, milestoneSchema, "Milestone"),
        ...validateEntityIdFormat(milestone, "milestone", "Milestone"),
        ...validateAllowedValue(milestone, "status", getConfiguredValues("milestoneStatuses"), "Milestone")
    ]);
}

function validateRisksSchema(risks = []) {
    return (risks || []).flatMap((risk) => [
        ...validateEntity(risk, riskSchema, "Risk"),
        ...validateEntityIdFormat(risk, "risk", "Risk"),
        ...validateAllowedValue(risk, "state", getConfiguredValues("riskStates"), "Risk"),
        ...validateAllowedValue(risk, "severity", getConfiguredValues("riskSeverityLevels"), "Risk"),
        ...validateAllowedValue(risk, "attention", getConfiguredValues("riskAttentionLevels"), "Risk"),
        ...validateAllowedValue(risk, "mitigation.status", getConfiguredValues("riskMitigationStates"), "Risk"),
        ...validateRelationshipsStructure(risk, "Risk")
    ]);
}

function validateDependenciesSchema(dependencies = []) {
    return (dependencies || []).flatMap((dependency) => [
        ...validateEntity(dependency, dependencySchema, "Dependency"),
        ...validateEntityIdFormat(dependency, "dependency", "Dependency"),
        ...validateAllowedValue(dependency, "status", getConfiguredValues("dependencyStatuses"), "Dependency"),
        ...validateAllowedValue(dependency, "severity", getConfiguredValues("dependencySeverity"), "Dependency"),
        ...validateRelationshipsStructure(dependency, "Dependency")
    ]);
}

function validateFeaturesSchema(features = []) {
    return (features || []).flatMap((feature) => [
        ...validateEntity(feature, featureSchema, "Feature"),
        ...validateEntityIdFormat(feature, "features", "Feature"),
        ...validateAllowedValue(feature, "status", getConfiguredValues("featureStatuses"), "Feature"),
        ...validateAllowedValue(feature, "confidence", getConfiguredValues("featureConfidence"), "Feature"),
        ...validateAllowedValue(feature, "risk", getConfiguredValues("featureRisks"), "Feature"),
        ...validateRelationshipsStructure(feature,"Feature")
    ]);
}

function validateRelationshipsStructure(entity, entityType) {
    const warnings = [];
    const relationships = entity.relationships;
    const validRelationshipTypes = ((typeof uiConfig !== "undefined" && uiConfig.relationshipTypes) ? uiConfig.relationshipTypes : []) || [];

    if (!relationships || typeof relationships !== "object") {
        warnings.push({
            severity: "High",
            category: "Schema",
            message: `${entityType} ${entity.id} has invalid relationships structure`
        });

        return warnings;
    }

    Object.entries(relationships).forEach(
        ([relationshipType, ids]) => {

            if (!validRelationshipTypes.includes(relationshipType)) {
                warnings.push({
                    severity: "High",
                    category: "Schema",
                    message: `${entityType} ${entity.id} has invalid relationship type: ${relationshipType}`
                });

                return;
            }

            if (!Array.isArray(ids)) {
                warnings.push({
                    severity: "High",
                    category: "Schema",
                    message: `${entityType} ${entity.id} relationships.${relationshipType} must be an array`
                });

                return;
            }

            ids.forEach((id) => {
                if (typeof id !== "string") {
                    warnings.push({
                        severity: "Medium",
                        category: "Schema",
                        message: `${entityType} ${entity.id} has non-string relationship ID`
                    });
                }
            });
        }
    );

    return warnings;
}

function validateFeatureMilestoneAlignment(features, milestones) {
    const warnings = [];

    features.forEach(
        (feature) => {
            const milestoneIds =
                feature.relationships
                    ?.milestones || [];

            milestoneIds.forEach(
                (milestoneId) => {
                    const milestone = milestones.find((item) => item.id === milestoneId);

                    if (!milestone) {
                        return;
                    }

                    const featureDate = new Date(feature.dueDate);
                    const milestoneDate = new Date(milestone.date);

                    if (featureDate > milestoneDate) {
                        warnings.push({
                            severity: "High",
                            category: "Topology",
                            message: `${feature.id} due date exceeds milestone ${milestone.id}`
                        });
                    }
                }
            );
        }
    );

    return warnings;
}

// Expose for Node unit tests
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        validateEntity,
        validateEntityIdFormat,
        validateRelationshipsStructure,
        validateAllowedValue,
        validateUniqueField,
        validateSnapshotUniqueness,
        validateRelationshipReferences
    };
}
