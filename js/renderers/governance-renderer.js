function renderGovernanceWarnings(warnings) {
    const container = document.getElementById("governance-warnings-container");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (warnings.length === 0) {
        return;
    }

    warnings.forEach((warning) => {
        const severity = warning.severity || "Unknown";
        const severityClass = severity.toLowerCase().replace(/[^a-z0-9-]/g, "-");

        container.innerHTML += `
            <div class="governance-warning ${severityClass}">
                <div class="governance-warning-header">
                    <span class="governance-severity">
                        ${escapeHtml(severity)}
                    </span>

                    <span class="governance-category">
                        <strong>
                            ${escapeHtml(warning.category || "Governance")}
                        </strong>
                    </span>
                </div>
                <div class="governance-message">
                    ${escapeHtml(warning.message || "No details available.")}
                </div>
            </div>
        `;
    });
}
