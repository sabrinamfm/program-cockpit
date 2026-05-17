function renderFeatures(features, currentSnapshot) {
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

    features.forEach(
        (feature) => {
            const row = document.createElement("tr");
            const relatedEntities = resolveRelationships(feature.relationships, currentSnapshot);
            const dependencies = relatedEntities.filter((entity) => entity.type === "dependencies");

            const dependenciesHtml =
                dependencies.length > 0
                    ? dependencies
                        .map((dependency) => 
                            `
                                <span class="relationship-pill">
                                    ${dependency.id} + ${dependency.title}
                                </span>
                            `
                        )
                        .join("")
                    : "—";

            const statusClass = feature.status.toLowerCase().replace(/\s+/g, "-");
            const confidenceClass =feature.confidence.toLowerCase();
            const riskClass = feature.risk.toLowerCase();

            row.innerHTML = `
                <td>
                    <strong>
                        ${feature.id}
                    </strong>
                </td>

                <td>
                    ${feature.title}
                </td>

                <td>
                    ${feature.owner}
                </td>

                <td>
                    ${feature.estimate}
                </td>

                <td>
                    <span class="badge feature-status-${statusClass}">
                        ${feature.status}
                    </span>
                </td>

                <td>
                    <span class="badge feature-confidence-${confidenceClass}">
                        ${feature.confidence}
                    </span>
                </td>

                <td>
                    <span class="badge feature-risk-${riskClass}">
                        ${feature.risk}
                    </span>
                </td>

                <td>
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