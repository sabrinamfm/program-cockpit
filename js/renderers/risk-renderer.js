function renderRisks(currentRisks = [], previousRisks = [], availableSnapshots = [], currentSnapshot = {}) {
    const container = document.getElementById("risks-container");
    const previousRiskTitles = (previousRisks || []).map((risk) => risk.title);

    window.currentRisksById = {};
    container.innerHTML = "";

    const table = document.createElement("table");
    table.className = "risk-table";
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Risk</th>
                <th>Owner</th>
                <th>Severity</th>
                <th>State</th>
                <th>Attention</th>
                <th>Mitigation</th>
                <th>Relationships</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    currentRisks.forEach((risk) => {
        const row = document.createElement("tr");
        const safeRisk = risk || {};
        const relatedEntities = resolveRelationships(safeRisk.relationships || {}, currentSnapshot || {});
        const relationshipsHtml =
                relatedEntities.length > 0
                    ? relatedEntities
                        .map((entity) => 
                            `
                                <span class="relationship-pill">
                                    ${escapeHtml(entity.id)} — ${escapeHtml(entity.title)}
                                </span>
                            `
                        )
                        .join("")
                    : "—";

        window.currentRisksById[safeRisk.id] = safeRisk;
        const state = safeRisk.state || "Unknown";
        const attention = safeRisk.attention || "Unknown";
        const mitigationStatus = safeRisk.mitigation?.status || "Unknown";
        const severity = safeRisk.severity || "Unknown";

        const stateClass = state.toLowerCase().replace(/\s+/g, "-");
        const attentionClass = attention.toLowerCase().replace(/\s+/g, "-");
        const mitigationClass = mitigationStatus.toLowerCase().replace(/\s+/g, "-");
        const severityClass = severity.toLowerCase().replace(/\s+/g, "-");

        row.innerHTML = `
            <td>
                <strong>${escapeHtml(safeRisk.id || "N/A")}</strong>
            </td>
            <td>${escapeHtml(safeRisk.title || "Untitled risk")}</td>
            <td>${escapeHtml(safeRisk.owner || "—")}</td>
            <td>
                <span class="badge severity-${severityClass}">
                    ${escapeHtml(severity)}
                </span>
            </td>
            <td>
                <span class="badge risk-state-${stateClass}">
                    ${escapeHtml(state)}
                </span>
            </td>
            <td>
                <span class="badge risk-attention-${attentionClass}">
                    ${escapeHtml(attention)}
                </span>
            </td>
            <td>
                <button 
                    type="button"
                    class="mitigation-button risk-mitigation-${mitigationClass}"
                    data-risk-id="${escapeHtml(safeRisk.id || "")}"
                >
                    ${escapeHtml(mitigationStatus)}
                </button>
            </td>
            <td>
                ${relationshipsHtml}
            </td>
        `;

        const mitigationButton = row.querySelector(".mitigation-button");
        if (mitigationButton) {
            mitigationButton.addEventListener("click", () => openMitigationModal(safeRisk.id || ""));
        }

        tbody.appendChild(row);
    });

    container.appendChild(table);
}
