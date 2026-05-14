async function loadData() {
    const programResponse = await fetch(
        "data/config/program.json"
    );

    const currentSnapshotResponse = await fetch(
        "data/snapshots/2026-05-13.json"
    );

    const previousSnapshotResponse = await fetch(
        "data/snapshots/2026-05-06.json"
    );

    const program = await programResponse.json();

    const currentSnapshot = await currentSnapshotResponse.json();

    const previousSnapshot = await previousSnapshotResponse.json();

    renderProgram(program, currentSnapshot, previousSnapshot);
}

function createCard(content) {
    const div = document.createElement("div");

    div.className = "card";

    div.innerHTML = content;

    return div;
}

function renderProgram(program, currentSnapshot, previousSnapshot) {
    renderHeader(program, currentSnapshot, previousSnapshot);
    renderWeeklySummary(currentSnapshot.weeklySummary);
    renderMilestones(currentSnapshot.milestones);
    renderFeatures(currentSnapshot.features);
    renderRisks(currentSnapshot.risks);
    renderDecisions(currentSnapshot.decisions);
    renderAttentionQueue(currentSnapshot.attentionQueue);
}

function renderHeader(program, currentSnapshot, previousSnapshot) {
    document.getElementById("program-name").innerText = program.programName;
    document.getElementById("executive-summary").innerText = program.executiveSummary;
    document.getElementById("target-launch").innerText = program.targetLaunch;
    document.getElementById("last-updated").innerText = currentSnapshot.lastUpdated;
    document.getElementById("milestones-title").innerText = program.sections.milestones;
    document.getElementById("risks-title").innerText = program.sections.risks;
    document.getElementById("features-title").innerText = program.sections.features;
    document.getElementById("decisions-title").innerText = program.sections.decisionLog;

    const labels = document.querySelectorAll(".metric-label");
    const values = document.querySelectorAll(".metric-value");

    program.healthMetrics.forEach((metric, index) => {
        labels[index].innerText = metric;
    });

    const confidenceDelta = 
        currentSnapshot.deliveryConfidence - previousSnapshot.deliveryConfidence;

    const deltaClass =
        confidenceDelta >= 0
            ? "delta-positive"
            : "delta-negative";

    const deltaArrow = confidenceDelta >= 0 ? "↑" : "↓";

    values[0].innerHTML = `
        <span class="metric-main">
            ${currentSnapshot.deliveryConfidence}%
        </span>

        <span class="metric-delta ${deltaClass}">
            (${deltaArrow}${Math.abs(confidenceDelta)}%)
        </span>
    `;
    
    values[1].innerText = currentSnapshot.activeRisks;
    values[2].innerText = currentSnapshot.blockedDependencies;
    values[3].innerText = currentSnapshot.pendingDecisions;
}

function renderWeeklySummary(summary) {
    const highlights = document.getElementById("highlights-list");
    const lowlights = document.getElementById("lowlights-list");

    highlights.innerHTML = "";
    lowlights.innerHTML = "";

    summary.highlights.forEach((item) => {
        highlights.innerHTML += `
            <li>${item}</li>
        `;
    });

    summary.lowlights.forEach((item) => {
        lowlights.innerHTML += `
            <li>${item}</li>
        `;
    });
}

function renderMilestones(milestones) {
    const container = document.getElementById("milestones-container");
    container.innerHTML = "";

    const timeline = document.createElement("div");
    timeline.className = "horizontal-timeline";

    milestones.forEach((milestone) => {
        const item = document.createElement("div");

        const statusClass =
            milestone.status === "On Track"
                ? "on-track"
                : "at-risk";

        item.className = "horizontal-timeline-item";

        item.innerHTML = `
            <div class="
                horizontal-marker
                ${statusClass}
            "></div>

            <div class="horizontal-content">
                <h3>${milestone.title}</h3>

                <p>${milestone.date}</p>

                <span class="status ${statusClass}">
                    ${milestone.status}
                </span>
            </div>
        `;
        timeline.appendChild(item);
    });
    container.appendChild(timeline);
}

function renderFeatures(features) {
    const container =
        document.getElementById("features-container");

    container.innerHTML = "";

    features.forEach((feature) => {
        const riskClass =
            feature.risk === "Elevated"
                ? "risk-high"
                : "risk-low";

        const dependenciesHtml =
            feature.dependencies
                .map((dependency) => {
                    return `
                        <div class="dependency-pill">
                            ${dependency}
                        </div>
                    `;
                })
                .join("");

        container.appendChild(
            createCard(`
                <div class="feature-header">
                    <h3>${feature.title}</h3>

                    <span class="risk-pill ${riskClass}">
                        ${feature.risk} Risk
                    </span>
                </div>

                <p><strong>Estimate:</strong>
                    ${feature.estimate}</p>

                <p><strong>Owner:</strong>
                    ${feature.owner}</p>

                <p><strong>Status:</strong>
                    ${feature.status}</p>

                <p><strong>Confidence:</strong>
                    ${feature.confidence}</p>

                <div class="dependencies-section">
                    <span class="dependency-label">
                        Dependencies
                    </span>

                    <div class="dependencies-container">
                        ${dependenciesHtml}
                    </div>
                </div>
            `)
        );
    });
}

function renderRisks(risks) {
    const container = document.getElementById("risks-container");

    container.innerHTML = "";

    risks.forEach((risk) => {
        const changeClass = risk.change.toLowerCase().replace(/\s/g, "-");

        container.appendChild(
            createCard(`
                <div class="risk-header">
                    <span class="
                        risk-change
                        ${changeClass}
                    ">
                        ${risk.change}
                    </span>

                </div>

                <h3>${risk.title}</h3>

                <p><strong>Impact:</strong>
                    ${risk.impact}</p>

                <p><strong>Attention:</strong>
                    ${risk.attention}</p>

                <div class="dependencies-section">
                    <span class="dependency-label">
                        Mitigation
                    </span>

                    <p>
                        ${risk.mitigation.description}
                    </p>

                    <div class="dependency-pill">
                        ${risk.mitigation.status}
                    </div>
                </div>
            `)
        );
    });
}

function renderDecisions(decisions) {
    const container =
        document.getElementById("decisions-container");

    container.innerHTML = "";

    decisions.forEach((decision) => {
        container.appendChild(
            createCard(`
                <h3>${decision.title}</h3>

                <p>${decision.description}</p>
            `)
        );
    });
}

function renderAttentionQueue(items) {
    const container =
        document.getElementById("attention-container");

    container.innerHTML = "";

    items.forEach((item) => {
        const attentionClass =
            item.type
                .toLowerCase()
                .replace(/\s/g, "-");

        container.appendChild(
            createCard(`
                <div class="attention-header">
                    <span class="
                        attention-badge
                        ${attentionClass}
                    ">
                        ${item.type}
                    </span>
                </div>

                <h3>${item.title}</h3>

                <p>
                    <strong>Owner:</strong>
                    ${item.owner}
                </p>

                <p class="attention-reason">
                    ${item.reason}
                </p>
            `)
        );
    });
}

loadData();