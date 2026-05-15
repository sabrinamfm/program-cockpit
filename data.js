async function loadData() {
    const snapshotsConfigResponse =
        await fetch(
            "data/config/snapshots.json"
        );

    const snapshotsConfig =
        await snapshotsConfigResponse.json();

    const sortedSnapshots =
        [...snapshotsConfig.availableSnapshots]
            .sort();

    const latestSnapshot =
        sortedSnapshots[
            sortedSnapshots.length - 1
        ];

    renderSnapshotSelector(
        sortedSnapshots,
        latestSnapshot
    );

    await loadSnapshot(
        latestSnapshot,
        sortedSnapshots
    );
}

async function loadSnapshot(
    snapshotId,
    availableSnapshots
) {
    const programResponse = await fetch(
        "data/config/program.json"
    );

    const currentSnapshotResponse =
        await fetch(
            `data/snapshots/${snapshotId}.json`
        );

    const currentSnapshot =
        await currentSnapshotResponse.json();

    const snapshotIndex =
        availableSnapshots.indexOf(snapshotId);

    let previousSnapshot = {
        deliveryConfidence:
            currentSnapshot.deliveryConfidence
    };

    if (snapshotIndex > 0) {
        const previousSnapshotId =
            availableSnapshots[
                snapshotIndex - 1
            ];

        const previousSnapshotResponse =
            await fetch(
                `data/snapshots/${previousSnapshotId}.json`
            );

        previousSnapshot =
            await previousSnapshotResponse.json();
    }

    const program =
        await programResponse.json();

    renderProgram(
        program,
        currentSnapshot,
        previousSnapshot,
        availableSnapshots
    );
}

function renderSnapshotSelector(
    snapshots,
    latestSnapshot
) {
    const selector =
        document.getElementById(
            "snapshot-selector"
        );

    selector.innerHTML = "";

    snapshots.forEach((snapshot) => {
        const option =
            document.createElement("option");

        option.value = snapshot;

        option.innerText = snapshot;

        if (snapshot === latestSnapshot) {
            option.selected = true;
        }

        selector.appendChild(option);
    });

    selector.addEventListener(
        "change",
        async (event) => {
            await loadSnapshot(
                event.target.value,
                snapshots
            );
        }
    );
}

function createCard(content) {
    const div = document.createElement("div");

    div.className = "card";

    div.innerHTML = content;

    return div;
}

function renderProgram(program, currentSnapshot, previousSnapshot, availableSnapshots) {
    renderHeader(program, currentSnapshot, previousSnapshot);

    renderWeeklySummary(
        currentSnapshot.weeklySummary
    );

    renderMilestones(currentSnapshot.milestones);
    renderFeatures(currentSnapshot.features);
    renderRisks(currentSnapshot.risks, previousSnapshot.risks || [], availableSnapshots, availableSnapshots);
    renderDecisions(currentSnapshot.decisions);
    renderAttentionQueue(currentSnapshot.attentionQueue);
}

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

function renderWeeklySummary(
    summary
) {
    const highlights =
        document.getElementById(
            "highlights-list"
        );

    const lowlights =
        document.getElementById(
            "lowlights-list"
        );

    highlights.innerHTML = "";

    lowlights.innerHTML = "";

    summary.highlights.forEach(
        (item) => {
            highlights.innerHTML += `
                <li>${item}</li>
            `;
        }
    );

    summary.lowlights.forEach(
        (item) => {
            lowlights.innerHTML += `
                <li>${item}</li>
            `;
        }
    );
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

function renderRisks(currentRisks, previousRisks, availableSnapshots) {
    const container =
        document.getElementById("risks-container");

    container.innerHTML = "";

    const previousRiskTitles =
        previousRisks.map((risk) => risk.title);

    currentRisks.forEach((risk) => {
        let changeType = "";
        const riskAge = calculateRiskAge(risk, availableSnapshots);

        if (
            !previousRiskTitles.includes(
                risk.title
            )
        ) {
            changeType = "New";
        }

        container.appendChild(
            createCard(`
                ${
                    changeType
                        ? `
                        <div class="risk-header">

                            <span class="
                                risk-change
                                new
                            ">
                                ${changeType}
                            </span>

                        </div>
                    `
                        : ""
                }

                <h3>${risk.title}</h3>

                <p><strong>Impact:</strong>
                    ${risk.impact}</p>

                <p><strong>Attention:</strong>
                    ${risk.attention}</p>

                ${
                    riskAge
                        ? `
                            <p>
                                <strong>Age:</strong>
                                ${riskAge} snapshot(s)
                            </p>
                        `
                        : ""
                }

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

function calculateRiskAge(
    risk,
    availableSnapshots
) {
    if (!risk.introduced) {
        return null;
    }

    const introducedIndex =
        availableSnapshots.indexOf(
            risk.introduced
        );

    if (introducedIndex === -1) {
        return null;
    }

    return (
        availableSnapshots.length -
        introducedIndex
    );
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