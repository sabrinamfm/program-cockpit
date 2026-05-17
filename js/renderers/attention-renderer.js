function renderAttentionQueue(items = []) {
    const container = document.getElementById("attention-container");

    container.innerHTML = "";

    (items || []).forEach((item) => {
        const safeItem = item || {};
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