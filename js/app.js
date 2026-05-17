/*
- Orchestration
- Lifecycle
- Snapshot loading
- Sequencing
*/

async function loadData() {
    clearError();

    try {
        showLoading("Loading configuration...");

        const snapshotsConfigResponse = await fetch("data/config/snapshots.json");
        if (!snapshotsConfigResponse.ok) throw new Error(`Failed to load snapshots config: ${snapshotsConfigResponse.status}`);
        const snapshotsConfig = await snapshotsConfigResponse.json();

        const uiConfigResponse = await fetch("data/config/ui.json");
        if (!uiConfigResponse.ok) throw new Error(`Failed to load ui config: ${uiConfigResponse.status}`);

        uiConfig = await uiConfigResponse.json();

        const sortedSnapshots = [...snapshotsConfig.availableSnapshots].sort();
        const latestSnapshot = sortedSnapshots[sortedSnapshots.length - 1];

        renderSnapshotSelector(sortedSnapshots, latestSnapshot);

        await loadSnapshot(latestSnapshot, sortedSnapshots);

        clearLoading();
    } catch (err) {
        console.error(err);
        clearLoading();
        showError(`Error loading data: ${err.message}`);
    }
}

function renderProgram(program, currentSnapshot, previousSnapshot, availableSnapshots, historicalSnapshots) {
    clearError();
    renderHeader(program, currentSnapshot, previousSnapshot);
    const warnings = collectGovernanceWarnings(currentSnapshot, previousSnapshot);
    renderWeeklySummary(currentSnapshot.weeklySummary);
    renderOKRs(currentSnapshot.relatedOKRs);
    renderMilestones(currentSnapshot.milestones);
    renderFeatures(currentSnapshot.features, currentSnapshot);
    renderRisks(currentSnapshot.risks, previousSnapshot.risks || [], availableSnapshots, currentSnapshot);
    renderDependencies(currentSnapshot.dependencies);
    renderDecisions(currentSnapshot.decisions);
    renderAttentionQueue(resolveAttentionEntities(currentSnapshot));
    renderGovernanceWarnings(warnings);
}

function createCard(content) {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = content;
    return div;
}

loadData();