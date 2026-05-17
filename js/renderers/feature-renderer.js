function renderFeatures(features = [], currentSnapshot = {}) {
    const container = document.getElementById("features-container");

    container.innerHTML = "";

    const table = document.createElement("table");

    table.className = "feature-table";

    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Feature</th>
                <th>Owner</th>
                <th>Estimate</th>
                <th>Status</th>
                <th>Confidence</th>
                <th>Risk</th>
                <th>Dependencies</th>
            </tr>
        </thead>

        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    (features || []).forEach(
        (feature) => {
            const row = document.createElement("tr");
            const safeFeature = feature || {};
            const relatedEntities = resolveRelationships(safeFeature.relationships || {}, currentSnapshot);
            const dependencies = relatedEntities.filter((entity) => entity.type === "dependencies");

            const dependenciesHtml =
                dependencies.length > 0
                    ? `
                        <ul class="relationship-list-stack">
                            ${dependencies
                        .map((dependency) => 
                                `
                                    <li>
                                        <span class="relationship-id">${escapeHtml(dependency.id)}</span>
                                        <span class="relationship-title">${escapeHtml(dependency.title)}</span>
                                    </li>
                                `
                            )
                        .join("")}
                        </ul>
                    `
                    : "—";

            const status = safeFeature.status || "Unknown";
            const confidence = safeFeature.confidence || "Unknown";
            const risk = safeFeature.risk || "Unknown";
            const statusClass = status.toLowerCase().replace(/\s+/g, "-");
            const confidenceClass = confidence.toLowerCase().replace(/\s+/g, "-");
            const riskClass = risk.toLowerCase().replace(/\s+/g, "-");

            row.innerHTML = `
                <td class="entity-id-cell">
                    <strong>${escapeHtml(safeFeature.id || "N/A")}</strong>
                </td>

                <td>
                    ${escapeHtml(safeFeature.title || "Untitled feature")}
                </td>

                <td>
                    ${escapeHtml(safeFeature.owner || "—")}
                </td>

                <td>
                    ${escapeHtml(safeFeature.estimate || "—")}
                </td>

                <td>
                    <span class="badge feature-status-${statusClass}">
                        ${escapeHtml(status)}
                    </span>
                </td>

                <td>
                    <span class="badge feature-confidence-${confidenceClass}">
                        ${escapeHtml(confidence)}
                    </span>
                </td>

                <td>
                    <span class="badge feature-risk-${riskClass}">
                        ${escapeHtml(risk)}
                    </span>
                </td>

                <td class="relationship-cell">
                    ${dependenciesHtml}
                </td>
            `;

            tbody.appendChild(
                row
            );
        }
    );

    container.appendChild(
        table
    );
}
