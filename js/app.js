/*
- Orchestration
- Lifecycle
- Snapshot loading
- Sequencing
*/

async function loadData() {
    const snapshotsConfigResponse = await fetch("data/config/snapshots.json");
    const snapshotsConfig = await snapshotsConfigResponse.json();
    const uiConfigResponse = await fetch("data/config/ui.json");

    uiConfig = await uiConfigResponse.json();

    const sortedSnapshots = [...snapshotsConfig.availableSnapshots].sort();
    const latestSnapshot = sortedSnapshots[sortedSnapshots.length - 1];

    renderSnapshotSelector(sortedSnapshots, latestSnapshot);

    await loadSnapshot(latestSnapshot, sortedSnapshots);
}

function renderProgram(program, currentSnapshot, previousSnapshot, availableSnapshots, historicalSnapshots) {
    renderHeader(program, currentSnapshot, previousSnapshot);
    const warnings = validateRisks(
        currentSnapshot.risks, 
        previousSnapshot.risks || [], 
        currentSnapshot.attentionQueue || [], 
        availableSnapshots
    );
    const confidenceTrendWarning = detectConfidenceTrend(historicalSnapshots);

    if (confidenceTrendWarning) {
        warnings.push(confidenceTrendWarning);
    }

    const milestoneWarnings = detectMilestoneDrift(currentSnapshot.milestones, previousSnapshot.milestones || []);
    warnings.push(...milestoneWarnings);

    const contradictionWarnings = detectOperationalContradictions(currentSnapshot, previousSnapshot);
    warnings.push(...contradictionWarnings);

    warnings.push(...validateRisksSchema(currentSnapshot.risks));
    warnings.push(...validateDecisionsSchema(currentSnapshot.decisions));
    warnings.push(...validateMilestonesSchema(currentSnapshot.milestones));
    warnings.push(...validateAttentionsSchema(currentSnapshot.attentionQueue));
    warnings.push(...validateDependenciesSchema(currentSnapshot.dependencies));
    warnings.push(...validateDependencyHealth(currentSnapshot.dependencies));
    
    renderWeeklySummary(currentSnapshot.weeklySummary);
    renderOKRs(currentSnapshot.relatedOKRs);
    renderMilestones(currentSnapshot.milestones);
    renderFeatures(currentSnapshot.features);
    renderRisks(currentSnapshot.risks, previousSnapshot.risks || [], availableSnapshots, currentSnapshot);
    renderDependencies(currentSnapshot.dependencies);
    renderDecisions(currentSnapshot.decisions);
    const resolvedAttentionQueue = resolveAttentionEntities(currentSnapshot);
    renderAttentionQueue(resolvedAttentionQueue);
    renderGovernanceWarnings(warnings);
}

function createCard(content) {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = content;
    return div;
}

loadData();