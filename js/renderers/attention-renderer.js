function renderAttentionQueue(items = [], mode = "summary") {
    let visibleItems = items;

    if (mode === "detailed") {
        renderDetailedAttentionQueue(items);
        return;
    }

    if (mode === "summary") {
        visibleItems = items.slice(0, 3);
    }

    const container = document.getElementById("attention-container");

    container.innerHTML = "";

    (visibleItems || []).forEach((visibleItems) => {
        const safeItem = visibleItems || {};
        const queueLevel = safeItem.queueLevel || "Unknown";
        const queueLevelClass = queueLevel.toLowerCase().replace(/\s/g, "-");
        const entity = safeItem.entity || {};

        const card = createCard(`
            <div class="attention-header">
                <span class="badge attention-queue-${queueLevelClass}">
                    ${escapeHtml(queueLevel)}
                </span>
            </div>
            <h3>${escapeHtml(entity.title || "Untitled item")}</h3>
            <p>
                <strong>Type:</strong>
                ${escapeHtml(safeItem.entityType || "Unknown")}
            </p>
            ${
                entity.owner
                    ? `
                        <p>
                            <strong>Owner:</strong>
                            ${escapeHtml(entity.owner)}
                        </p>
                    `
                    : ""
            }

            <p>
                ${escapeHtml(safeItem.reason || "—")}
            </p>
        `);
        container.appendChild(card);
    });
}

function renderDetailedAttentionQueue(items) {
    const container = document.getElementById("operations-attention-container");

    container.innerHTML = "";

    const table = document.createElement("table");
    table.className = "attention-table";
    table.innerHTML = `
        <thead>
            <tr>
                <th>Level</th>
                <th>Entity</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Reason</th>
            </tr>
        </thead>

        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    items.forEach((item) => {
        const row = document.createElement("tr");
        const queueLevelClass = item.queueLevel.toLowerCase().replace(/\s+/g, "-");

        row.innerHTML = `
            <td>
                <span class="attention-level-badge attention-queue-${queueLevelClass}">
                    ${item.queueLevel}
                </span>
            </td>

            <td>
                ${item.entityId}
            </td>

            <td>
                ${item.entityType}
            </td>

            <td>
                ${item.owner || "—"}
            </td>

            <td>
                ${item.reason}
            </td>
        `;

        tbody.appendChild(row);
    });

    container.appendChild(table);
}