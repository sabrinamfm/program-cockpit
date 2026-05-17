function renderDependencies(dependencies = []) {
    const container = document.getElementById("dependencies-container");

    container.innerHTML = "";

    (dependencies || []).forEach(
        (dependency) => {
            const safeDependency = dependency || {};
            const status = safeDependency.status || "Unknown";
            const severity = safeDependency.severity || "Unknown";
            const statusClass = status.toLowerCase().replace(/\s+/g, "-");
            const severityClass = severity.toLowerCase().replace(/\s+/g, "-");

            const card = createCard(`
                <div class="dependency-status-wrapper">
                    <h3>${escapeHtml(safeDependency.title || "Untitled dependency")}</h3>
                    <span class="badge dependency-${statusClass}">
                        ${escapeHtml(status)}
                    </span>
                </div>

                <p>
                    <strong>Description:</strong>
                    ${escapeHtml(safeDependency.description || "—")}
                </p>

                <p>
                    <strong>Owner:</strong>
                    ${escapeHtml(safeDependency.owner || "—")}
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