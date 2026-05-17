function renderDecisions(decisions = []) {
    const container = document.getElementById("decisions-container");

    container.innerHTML = "";

    (decisions || []).forEach(
        (decision) => {
            const safeDecision = decision || {};
            const status = safeDecision.status || "Unknown";
            const severity = safeDecision.severity || "Unknown";
            const statusClass = status.toLowerCase().replace(/\s+/g, "-");
            const severityClass = severity.toLowerCase().replace(/\s+/g, "-");

            const card = createCard(`
                <div class="dependency-status-wrapper">
                    <h3>${escapeHtml(safeDecision.title || "Untitled decision")}</h3>
                    <span class="badge decision-status-${statusClass}">
                        ${escapeHtml(status)}
                    </span>
                </div>

                <p>
                    <strong>Description:</strong>
                    ${escapeHtml(safeDecision.description || "—")}
                </p>

                <p>
                    <strong>Owner:</strong>
                    ${escapeHtml(safeDecision.owner || "—")}
                </p>

                <p>
                    <strong>Severity:</strong>
                    <span class="badge severity-${severityClass}">
                        ${escapeHtml(severity)}
                    </span>
                </p>
            `);

            container.appendChild(card);
        }
    );
}