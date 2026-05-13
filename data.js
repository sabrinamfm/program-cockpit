async function loadData() {
    const programResponse = await fetch(
        "data/config/program.json"
    );

    const snapshotResponse = await fetch(
        "data/snapshots/2026-05-13.json"
    );

    const program = await programResponse.json();

    const snapshot = await snapshotResponse.json();

    renderProgram(program, snapshot);
}

function createCard(content) {
    const div = document.createElement("div");

    div.className = "card";

    div.innerHTML = content;

    return div;
}

function renderProgram(program, snapshot) {
    renderHeader(program, snapshot);

    renderMilestones(snapshot.milestones);

    renderFeatures(snapshot.features);

    renderRisks(snapshot.risks);

    renderDecisions(snapshot.decisions);
}

function renderHeader(program, snapshot) {
    document.getElementById("program-name").innerText =
        program.programName;

    document.getElementById("executive-summary").innerText =
        program.executiveSummary;

    document.getElementById("target-launch").innerText =
        program.targetLaunch;

    document.getElementById("last-updated").innerText =
        snapshot.lastUpdated;

    document.getElementById("milestones-title").innerText =
        program.sections.milestones;

    document.getElementById("risks-title").innerText =
        program.sections.risks;

    document.getElementById("features-title").innerText =
        program.sections.features;

    document.getElementById("decisions-title").innerText =
        program.sections.decisionLog;

    const labels =
        document.querySelectorAll(".metric-label");

    const values =
        document.querySelectorAll(".metric-value");

    program.healthMetrics.forEach((metric, index) => {
        labels[index].innerText = metric;
    });

    values[0].innerText =
        `${snapshot.deliveryConfidence}%`;

    values[1].innerText =
        snapshot.activeRisks;

    values[2].innerText =
        snapshot.blockedDependencies;

    values[3].innerText =
        snapshot.pendingDecisions;
}

function renderMilestones(milestones) {
    const container =
        document.getElementById("milestones-container");

    container.innerHTML = "";

    const timeline = document.createElement("div");

    timeline.className = "timeline";

    milestones.forEach((milestone) => {
        const item = document.createElement("div");

        item.className = "timeline-item";

        const statusClass =
            milestone.status === "On Track"
                ? "on-track"
                : "at-risk";

        item.innerHTML = `
            <div class="timeline-marker ${statusClass}">
            </div>

            <div class="timeline-content">
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
    const container =
        document.getElementById("risks-container");

    container.innerHTML = "";

    risks.forEach((risk) => {
        container.appendChild(
            createCard(`
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

loadData();