function renderFeatures(features) {
    const container = document.getElementById("features-container");

    container.innerHTML = "";

    features.forEach((feature) => {
        const riskClass = feature.risk.toLowerCase().replace(/\s+/g,"-");
        const confidenceClass = feature.confidence.toLowerCase().replace(/\s+/g,"-");

        const dependenciesHtml =
            feature.dependencies
                .map((dependency) => {
                    return `
                        <div class="dependency-badge">
                            ${dependency}
                        </div>
                    `;
                })
                .join("");

        container.appendChild(
            createCard(`
                <div class="feature-header">
                    <h3>${feature.title}</h3>
                    <span class="badge confidence-${confidenceClass}">
                        ${feature.confidence} Confidence
                    </span>
                    <span class="badge risk-severity-${riskClass}">
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