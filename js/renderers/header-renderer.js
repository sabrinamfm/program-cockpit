function renderHeader(program, currentSnapshot, previousSnapshot) {
    document.getElementById("program-name").innerText = program.programName;
    document.getElementById("executive-summary").innerText = program.executiveSummary;
    document.getElementById("target-launch").innerText = program.targetLaunch;
    document.getElementById("last-updated").innerText = currentSnapshot.lastUpdated;
    document.getElementById("snapshot-note").innerText = currentSnapshot.metadata?.note || "";
    document.getElementById("milestones-title").innerText = program.sections.milestones;
    document.getElementById("risks-title").innerText = program.sections.risks;
    document.getElementById("features-title").innerText = program.sections.features;
    document.getElementById("decisions-title").innerText = program.sections.decisionLog;

    const labels = document.querySelectorAll(".metric-label");
    const values = document.querySelectorAll(".metric-value");

    program.healthMetrics.forEach((metric, index) => {
        labels[index].innerText = metric;
    });

    const confidenceDelta = currentSnapshot.deliveryConfidence - previousSnapshot.deliveryConfidence;
    const deltaClass = confidenceDelta >= 0 ? "delta-positive" : "delta-negative";
    const deltaArrow = confidenceDelta >= 0 ? "↑" : "↓";

    values[0].innerHTML = `
        <span class="metric-main">
            ${currentSnapshot.deliveryConfidence}%
        </span>
        <span class="metric-delta ${deltaClass}">
            (${deltaArrow}${Math.abs(confidenceDelta)}%)
        </span>
    `;
    
    values[1].innerText = calculateActiveRisks(currentSnapshot.risks);
    values[2].innerText = currentSnapshot.blockedDependencies;
    values[3].innerText = calculatePendingDecisions(currentSnapshot.decisions);
}