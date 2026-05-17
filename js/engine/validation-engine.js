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
    return risks.flatMap((risk) => [
        ...validateEntity(
            risk,
            riskSchema,
            "Risk"
        ),

        ...validateRelationshipsStructure(
            risk,
            "Risk"
        )
    ]);
}

function validateDependenciesSchema(dependencies) {
    return dependencies.flatMap((dependency) => [
        ...validateEntity(
            dependency,
            dependencySchema,
            "Dependency"
        ),

        ...validateRelationshipsStructure(
            dependency,
            "Dependency"
        )
    ]);
}

function validateFeaturesSchema(features) {
    return features.flatMap((feature) => [
        ...validateEntity(
            feature,
            featureSchema,
            "Feature"
        ),

        ...validateRelationshipsStructure(
            feature,
            "Feature"
        )
    ]);
}

function validateRelationshipsStructure(entity, entityType) {
    const warnings = [];
    const relationships = entity.relationships;
    const validRelationshipTypes = uiConfig.relationshipTypes || [];

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