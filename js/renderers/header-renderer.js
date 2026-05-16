function renderHeader(program, currentSnapshot, previousSnapshot) {
    document.getElementById("program-name").innerText = program.programName;
    document.getElementById("executive-summary").innerText = currentSnapshot.executiveSummary;
    
    const statusElement = document.getElementById("status-class");
    const statusClass = currentSnapshot.programStatus.toLowerCase().replace(/\s+/g, "-");
    statusElement.innerText = currentSnapshot.programStatus;
    statusElement.className = `program-status ${statusClass}`;

    document.getElementById("target-launch").innerText = currentSnapshot.targetLaunch;
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

    const declaredDeliveryConfidence = currentSnapshot.declaredDeliveryConfidence - previousSnapshot.declaredDeliveryConfidence;
    const deltaClass = declaredDeliveryConfidence >= 0 ? "delta-positive" : "delta-negative";
    const deltaArrow = declaredDeliveryConfidence >= 0 ? "↑" : "↓";

    values[0].innerHTML = `
        <span class="metric-main">
            ${currentSnapshot.declaredDeliveryConfidence}%
        </span>
        <span class="metric-delta ${deltaClass}">
            (${deltaArrow}${Math.abs(declaredDeliveryConfidence)}%)
        </span>
    `;
    
    values[1].innerText = calculateActiveRisks(currentSnapshot.risks);
    values[2].innerText = currentSnapshot.blockedDependencies;
    values[3].innerText = calculatePendingDecisions(currentSnapshot.decisions);
}