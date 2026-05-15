function renderFeatures(features) {
    const container = document.getElementById("features-container");

    container.innerHTML = "";

    features.forEach((feature) => {
        const riskClass = feature.risk === "Elevated" ? "risk-high" : "risk-low";

        const dependenciesHtml =
            feature.dependencies
                .map((dependency) => {
                    return `
                        <div class="dependency-pill">
                            ${dependency}
                        </div>
                    `;
                })
                .join("");

        container.appendChild(
            createCard(`
                <div class="feature-header">
                    <h3>${feature.title}</h3>
                    <span class="risk-pill ${riskClass}">
                        ${feature.risk} Risk
                    </span>
                </div>
                <p><strong>Estimate:</strong>
                    ${feature.estimate}</p>
                <p><strong>Owner:</strong>
                    ${feature.owner}</p>
                <p><strong>Status:</strong>
                    ${feature.status}</p>
                <p><strong>Confidence:</strong>
                    ${feature.confidence}</p>
                <div class="dependencies-section">
                    <span class="dependency-label">
                        Dependencies
                    </span>
                    <div class="dependencies-container">
                        ${dependenciesHtml}
                    </div>
                </div>
            `)
        );
    });
}