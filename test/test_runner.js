// Simple test runner using Node's built-in assert
const assert = require('assert');

const rel = require('../js/engine/relationship-engine');
const val = require('../js/engine/validation-engine');
const gov = require('../js/engine/governance-engine');
const risk = require('../js/engine/risk-engine');

function testResolveRelationships() {
    const relationships = { dependencies: ['d1'] };
    const snapshot = { dependencies: [{ id: 'd1', title: 'Dep One' }] };

    const resolved = rel.resolveRelationships(relationships, snapshot);
    assert(Array.isArray(resolved), 'resolved should be an array');
    assert(resolved.length === 1, 'should resolve one relationship');
    assert(resolved[0].id === 'd1');
    assert(resolved[0].title === 'Dep One');
}

function testValidateRelationshipsStructure() {
    const entity = { id: 'e1', relationships: { invalidType: ['x'] } };
    const warnings = val.validateRelationshipsStructure(entity, 'Entity');
    assert(Array.isArray(warnings));
    assert(warnings.length >= 1, 'should report invalid relationship type');
}

function testCalculateRiskAge() {
    const available = ['s1','s2','s3','s4'];
    const r = { introduced: 's2' };
    const age = risk.calculateRiskAge(r, available);
    assert(age === (available.length - 1));
}

function testDetectConfidenceTrend() {
    const snapshots = [
        { declaredDeliveryConfidence: 90 },
        { declaredDeliveryConfidence: 80 },
        { declaredDeliveryConfidence: 70 }
    ];

    const warning = gov.detectConfidenceTrend(snapshots);
    assert(warning && warning.category === 'Delivery Trend');
}

function testDetectMilestoneDrift() {
    const prev = [{ title: 'M1', date: '2026-05-01' }];
    const curr = [{ title: 'M1', date: '2026-05-05' }];

    const warnings = gov.detectMilestoneDrift(curr, prev);
    assert(Array.isArray(warnings));
    assert(warnings.length === 1, 'should detect milestone drift');
}

function runAll() {
    try {
        testResolveRelationships();
        console.log('testResolveRelationships passed');

        testValidateRelationshipsStructure();
        console.log('testValidateRelationshipsStructure passed');

        testCalculateRiskAge();
        console.log('testCalculateRiskAge passed');

        testDetectConfidenceTrend();
        console.log('testDetectConfidenceTrend passed');

        testDetectMilestoneDrift();
        console.log('testDetectMilestoneDrift passed');

        console.log('\nAll tests passed');
        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err.message);
        console.error(err.stack);
        process.exit(1);
    }
}

runAll();
