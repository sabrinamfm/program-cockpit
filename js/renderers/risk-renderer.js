function renderRisks(currentRisks, previousRisks, availableSnapshots, currentSnapshot) {
    const container = document.getElementById("risks-container");
    const previousRiskTitles = previousRisks.map((risk) => risk.title);

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
        const relatedEntities = resolveRelationships(risk.relationships, currentSnapshot);
        const relationshipsHtml =
                relatedEntities.length > 0
                    ? relatedEntities
                        .map((entity) => 
                            `
                                <span class="relationship-pill">
                                    ${entity.id} — ${entity.title}
                                </span>
                            `
                        )
                        .join("")
                    : "—";

        window.currentRisksById[risk.id] = risk;
        const stateClass = risk.state.toLowerCase().replace(/\s+/g, "-");
        const attentionClass = risk.attention.toLowerCase().replace(/\s+/g, "-");
        const mitigationClass = risk.mitigation.status.toLowerCase().replace(/\s+/g, "-");
        const severityClass = risk.severity.toLowerCase().replace(/\s+/g, "-");

        row.innerHTML = `
            <td>
                <strong>
                    ${risk.id}
                </strong>
            </td>
            <td>
                ${risk.title}
            </td>

            <td>
                ${risk.owner}
            </td>

            <td>
                <span class="badge severity-${severityClass}">
                    ${risk.severity}
                </span>
            </td>

            <td>
                <span class="badge risk-state-${stateClass}">
                    ${risk.state}
                </span>
            </td>

            <td>
                <span class="badge risk-attention-${attentionClass}">
                    ${risk.attention}
                </span>
            </td>

            <td>
                <button 
                    class="mitigation-button risk-mitigation-${mitigationClass}"
                    onclick="openMitigationModal('${risk.id}')"
                >
                    ${risk.mitigation.status}
                </button>
            </td>

            <td>
                ${relationshipsHtml}
            </td>
        `;

        tbody.appendChild(row);
    });

    container.appendChild(table);
}