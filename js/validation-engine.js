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

function validateAttentionsSchema(attentions) {
    return attentions.flatMap((attention) => validateEntity(attention, attentionSchema, "Attention"));
}

function validateDecisionsSchema(decisions) {
    return decisions.flatMap((decision) => validateEntity(decision, decisionSchema, "Decision"));
}

function validateMilestonesSchema(milestones) {
    return milestones.flatMap((milestone) => validateEntity(milestone, milestoneSchema, "Milestone"));
}

function validateRisksSchema(risks) {
    return risks.flatMap((risk) => validateEntity(risk, riskSchema, "Risk"));
}

function validateDependenciesSchema(dependencies) {
    return dependencies.flatMap((dependency) => validateEntity(dependency, dependencySchema, "Dependency"));
}

function validateFeaturesSchema(features) {
    return features.flatMap((feature) => validateEntity(feature, featureSchema, "Feature"));
}