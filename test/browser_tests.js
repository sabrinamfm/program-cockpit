function appendResult(name, passed, details = '') {
    const resultEl = document.createElement('div');
    resultEl.className = `result ${passed ? 'pass' : 'fail'}`;
    resultEl.innerHTML = `<strong>${name}</strong>: ${passed ? 'Passed' : 'Failed'}${details ? `<div>${details}</div>` : ''}`;
    document.getElementById('test-results').appendChild(resultEl);
}

function runTests() {
    let passed = 0;
    let failed = 0;

    function test(name, fn) {
        try {
            fn();
            appendResult(name, true);
            passed += 1;
        } catch (error) {
            appendResult(name, false, error.message || String(error));
            failed += 1;
        }
    }

    test('resolveRelationships should map IDs to snapshot entities', () => {
        const relationships = { dependencies: ['d1'] };
        const snapshot = { dependencies: [{ id: 'd1', title: 'Dep One' }] };
        const resolved = resolveRelationships(relationships, snapshot);

        if (!Array.isArray(resolved) || resolved.length !== 1) {
            throw new Error('Expected one resolved relationship');
        }
        if (resolved[0].id !== 'd1' || resolved[0].title !== 'Dep One') {
            throw new Error('Resolved entity did not match expected values');
        }
    });

    test('findEntityById should locate items by type and id', () => {
        const snapshot = {
            risks: [{ id: 'r1', title: 'Risk One' }],
            dependencies: [{ id: 'd1', title: 'Dep One' }],
            milestones: [{ id: 'm1', title: 'Milestone One' }],
            decisions: [{ id: 'dec1', title: 'Decision One' }],
            relatedOKRs: [{ id: 'okr1', objective: 'OKR One' }],
            features: [{ id: 'f1', title: 'Feature One' }]
        };

        const risk = findEntityById('risks', 'r1', snapshot);
        const okr = findEntityById('okrs', 'okr1', snapshot);
        const feature = findEntityById('features', 'f1', snapshot);

        if (!risk || risk.title !== 'Risk One') throw new Error('Risk not found');
        if (!okr || okr.objective !== 'OKR One') throw new Error('OKR not found');
        if (!feature || feature.title !== 'Feature One') throw new Error('Feature not found');

        if (!risk || risk.title !== 'Risk One') throw new Error('Risk not found');
        if (!okr || okr.objective !== 'OKR One') throw new Error('OKR not found');
    });

    test('resolveRelationships should resolve feature relationships', () => {
        const relationships = { features: ['f1'] };
        const snapshot = { features: [{ id: 'f1', title: 'Feature One' }] };
        const resolved = resolveRelationships(relationships, snapshot);

        if (!Array.isArray(resolved) || resolved.length !== 1) {
            throw new Error('Expected one resolved relationship for feature');
        }
        if (resolved[0].id !== 'f1' || resolved[0].title !== 'Feature One') {
            throw new Error('Resolved feature did not match expected values');
        }
    });

    test('validateRelationshipsStructure should warn for invalid relationship types', () => {
        uiConfig.relationshipTypes = ['dependencies', 'risks', 'milestones', 'decisions', 'okrs'];
        const entity = { id: 'e1', relationships: { unknownType: ['x'] } };
        const warnings = validateRelationshipsStructure(entity, 'Entity');

        if (!Array.isArray(warnings) || warnings.length === 0) {
            throw new Error('Expected warnings for invalid relationship type');
        }
    });

    test('validateRisks should warn when unresolved risk exceeds age without attention', () => {
        uiConfig.riskStates = ['Unresolved', 'Mitigated', 'Accepted', 'Monitoring', 'Closed'];
        const currentRisks = [
            { id: 'r1', title: 'Risk One', state: 'Unresolved', introduced: 's1', attention: 'Monitor', mitigation: { status: 'Proposed' } }
        ];
        const previousRisks = [
            { id: 'r1', title: 'Risk One', state: 'Unresolved', introduced: 's1', attention: 'Monitor', mitigation: { status: 'Proposed' } }
        ];
        const warnings = validateRisks(currentRisks, previousRisks, [], ['s1', 's2', 's3', 's4']);

        if (!Array.isArray(warnings) || warnings.every((w) => w.category !== 'Governance Attention')) {
            throw new Error('Expected Governance Attention warning for unresolved risk age');
        }
    });

    test('calculateRiskAge should compute age from available snapshots', () => {
        const availableSnapshots = ['s1', 's2', 's3', 's4'];
        const risk = { introduced: 's2' };
        const age = calculateRiskAge(risk, availableSnapshots);

        if (age !== 3) {
            throw new Error(`Expected age 3, got ${age}`);
        }
    });

    test('detectConfidenceTrend should warn when confidence decreases 3 snapshots', () => {
        const snapshots = [
            { declaredDeliveryConfidence: 90 },
            { declaredDeliveryConfidence: 80 },
            { declaredDeliveryConfidence: 70 }
        ];
        const warning = detectConfidenceTrend(snapshots);

        if (!warning || warning.category !== 'Delivery Trend') {
            throw new Error('Expected Delivery Trend warning');
        }
    });

    test('detectMilestoneDrift should report drift between matching milestones', () => {
        const previousMilestones = [{ title: 'M1', date: '2026-05-01' }];
        const currentMilestones = [{ title: 'M1', date: '2026-05-05' }];
        const warnings = detectMilestoneDrift(currentMilestones, previousMilestones);

        if (!Array.isArray(warnings) || warnings.length !== 1) {
            throw new Error('Expected one milestone drift warning');
        }
    });

    document.getElementById('summary').innerHTML = `Passed: ${passed}<br>Failed: ${failed}`;
}

window.addEventListener('DOMContentLoaded', runTests);
