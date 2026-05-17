function resolveRelationships(relationships, snapshot) {
    const resolved = [];

    Object.entries(relationships || {}).forEach(
        ([entityType, ids]) => {
            ids.forEach((id) => { 
                const entity = findEntityById(entityType, id, snapshot);

                if (entity) {
                    resolved.push({ type: entityType, id: id, title: entity.title || entity.objective});
                }
            });
        }
    );

    return resolved;
}

function findEntityById(entityType, id, snapshot) {
    const collectionMap = {
        risks: snapshot.risks,
        dependencies: snapshot.dependencies,
        milestones: snapshot.milestones,
        decisions: snapshot.decisions,
        okrs: snapshot.relatedOKRs
    };

    const collection = collectionMap[entityType];

    if (!collection) {
        return null;
    }

    return collection.find((entity) => entity.id === id);
}

// Expose for Node unit tests
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        resolveRelationships,
        findEntityById
    };
}
