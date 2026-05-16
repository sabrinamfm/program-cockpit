function renderDependencies(dependencies) {
    const container = document.getElementById("dependencies-container");

    container.innerHTML = "";

    dependencies.forEach(
        (dependency) => {
            const statusClass =
                dependency.status
                    .toLowerCase()
                    .replace(
                        /\s+/g,
                        "-"
                    );

            const card =
                createCard(`
                    <div class="dependency-status-wrapper">
                        <span class="
                            dependency-status-badge
                            dependency-${statusClass}
                        ">
                            ${dependency.status}
                        </span>
                    </div>

                    <h3>
                        ${dependency.title}
                    </h3>

                    <p>
                        <strong>Owner:</strong>
                        ${dependency.owner}
                    </p>

                    <p>
                        ${dependency.description}
                    </p>
                `);

            container.appendChild(
                card
            );
        }
    );
}