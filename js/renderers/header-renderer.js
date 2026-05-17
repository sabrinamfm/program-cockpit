function renderHeader(program = {}, currentSnapshot = {}, previousSnapshot = {}) {
    document.getElementById("program-name").innerText = program.programName || "Program Cockpit";
    document.getElementById("executive-summary").innerText = currentSnapshot.executiveSummary || "";
    
    const statusElement = document.getElementById("status-class");
    const status = currentSnapshot.programStatus || "Unknown";
    const statusClass = status.toLowerCase().replace(/\s+/g, "-");
    statusElement.innerText = status;
    statusElement.className = `program-status ${statusClass}`;

    document.getElementById("target-launch").innerText = currentSnapshot.targetLaunch || "—";
    document.getElementById("last-updated").innerText = currentSnapshot.lastUpdated || "—";
    document.getElementById("snapshot-note").innerText = currentSnapshot.metadata?.note || "";
    document.getElementById("milestones-title").innerText = program.sections?.milestones || "Milestones";
    document.getElementById("risks-title").innerText = program.sections?.risks || "Risks";
    document.getElementById("features-title").innerText = program.sections?.features || "Features";
    document.getElementById("decisions-title").innerText = program.sections?.decisionLog || "Decisions";

    const labels = document.querySelectorAll(".metric-label");
    const values = document.querySelectorAll(".metric-value");

    (program.healthMetrics || []).forEach((metric, index) => {
        if (labels[index]) labels[index].innerText = metric;
    });

    const currentConfidence = Number(currentSnapshot.declaredDeliveryConfidence ?? 0);
    const previousConfidence = Number(previousSnapshot.declaredDeliveryConfidence ?? currentConfidence);
    const declaredDeliveryConfidence = currentConfidence - previousConfidence;
    const deltaClass = declaredDeliveryConfidence >= 0 ? "delta-positive" : "delta-negative";
    const deltaArrow = declaredDeliveryConfidence >= 0 ? "↑" : "↓";

    if (values[0]) {
        values[0].innerHTML = `
            <span class="metric-main">
                ${escapeHtml(currentConfidence)}%
            </span>
            <span class="metric-delta ${deltaClass}">
                (${deltaArrow}${escapeHtml(Math.abs(declaredDeliveryConfidence))}%)
            </span>
        `;
    }

    if (values[1]) values[1].innerText = calculateActiveRisks(currentSnapshot.risks);
    if (values[2]) values[2].innerText = calculateBlockedDependencies(currentSnapshot.dependencies);
    if (values[3]) values[3].innerText = calculatePendingDecisions(currentSnapshot.decisions);
}