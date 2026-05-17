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

function validateAttentionsSchema(attentions = []) {
    return (attentions || []).flatMap((attention) => [
        ...validateEntity(attention, attentionSchema, "Attention"),
        ...validateAllowedValue(attention, "queueLevel", getConfiguredValues("queueLevels"), "Attention")
    ]);
}

function validateDecisionsSchema(decisions = []) {
    return (decisions || []).flatMap((decision) => [
        ...validateEntity(decision, decisionSchema, "Decision"),
        ...validateAllowedValue(decision, "status", getConfiguredValues("decisionStatuses"), "Decision"),
        ...validateAllowedValue(decision, "severity", getConfiguredValues("riskSeverityLevels"), "Decision")
    ]);
}

function validateMilestonesSchema(milestones = []) {
    return (milestones || []).flatMap((milestone) => [
        ...validateEntity(milestone, milestoneSchema, "Milestone"),
        ...validateAllowedValue(milestone, "status", getConfiguredValues("milestoneStatuses"), "Milestone")
    ]);
}

function validateRisksSchema(risks = []) {
    return (risks || []).flatMap((risk) => [
        ...validateEntity(
            risk,
            riskSchema,
            "Risk"
        ),

        ...validateAllowedValue(risk, "state", getConfiguredValues("riskStates"), "Risk"),

        ...validateAllowedValue(risk, "severity", getConfiguredValues("riskSeverityLevels"), "Risk"),

        ...validateAllowedValue(risk, "attention", getConfiguredValues("riskAttentionLevels"), "Risk"),

        ...validateAllowedValue(risk, "mitigation.status", getConfiguredValues("riskMitigationStates"), "Risk"),

        ...validateRelationshipsStructure(
            risk,
            "Risk"
        )
    ]);
}

function validateDependenciesSchema(dependencies = []) {
    return (dependencies || []).flatMap((dependency) => [
        ...validateEntity(
            dependency,
            dependencySchema,
            "Dependency"
        ),

        ...validateAllowedValue(dependency, "status", getConfiguredValues("dependencyStatuses"), "Dependency"),

        ...validateAllowedValue(dependency, "severity", getConfiguredValues("dependencySeverity"), "Dependency"),

        ...validateRelationshipsStructure(
            dependency,
            "Dependency"
        )
    ]);
}

function validateFeaturesSchema(features = []) {
    return (features || []).flatMap((feature) => [
        ...validateEntity(
            feature,
            featureSchema,
            "Feature"
        ),

        ...validateAllowedValue(feature, "status", getConfiguredValues("featureStatuses"), "Feature"),

        ...validateAllowedValue(feature, "confidence", getConfiguredValues("featureConfidence"), "Feature"),

        ...validateAllowedValue(feature, "risk", getConfiguredValues("featureRisks"), "Feature"),

        ...validateRelationshipsStructure(
            feature,
            "Feature"
        )
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

// Expose for Node unit tests
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        validateEntity,
        validateRelationshipsStructure,
        validateAllowedValue
    };
}
