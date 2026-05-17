function renderDependencies(dependencies) {
    const container = document.getElementById("dependencies-container");

    container.innerHTML = "";

    dependencies.forEach(
        (dependency) => {
            const statusClass = dependency.status.toLowerCase().replace(/\s+/g, "-");
            const severityClass = dependency.severity.toLowerCase().replace(/\s+/g, "-");

            const card =
                createCard(`
                    <div class="dependency-status-wrapper">
                        <h3>
                            ${dependency.title}
                        </h3>
                        <span class="badge dependency-${statusClass}">
                            ${dependency.status}
                        </span>
                    </div>

                    <p>
                        <strong>Description:</strong>
                        ${dependency.description}
                    </p>

                    <p>
                        <strong>Owner:</strong>
                        ${dependency.owner}
                    </p>

                    <p>
                        <strong>Severity:</strong>
                        <span class="badge severity-${severityClass}">
                            ${dependency.severity}
                        </span>
                    </p>
                `);

            container.appendChild(
                card
            );
        }
    );
}