function renderDecisions(decisions) {
    const container = document.getElementById("decisions-container");

    container.innerHTML = "";

    decisions.forEach(
        (decision) => {
            const statusClass = decision.status.toLowerCase().replace(/\s+/g, "-");
            const severityClass = decision.severity.toLowerCase().replace(/\s+/g, "-");

            const card =
                createCard(`
                    <div class="dependency-status-wrapper">
                        <h3>
                            ${decision.title}
                        </h3>
                        <span class="badge dependency-${statusClass}">
                            ${decision.status}
                        </span>
                    </div>

                    <p>
                        ${decision.description}
                    </p>

                    <p>
                        <strong>Owner:</strong>
                        ${decision.owner}
                    </p>

                    <p>
                        <strong>Severity:</strong>
                        <span class="badge severity-${severityClass}">
                            ${decision.severity}
                        </span>
                    </p>
                `);

            container.appendChild(
                card
            );
        }
    );
}