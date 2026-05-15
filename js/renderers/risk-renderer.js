function renderRisks(currentRisks, previousRisks, availableSnapshots) {
    const container = document.getElementById("risks-container");

    container.innerHTML = "";

    const previousRiskTitles = previousRisks.map((risk) => risk.title);

    currentRisks.forEach((risk) => {
        let changeType = "";
        const riskAge = calculateRiskAge(risk, availableSnapshots);

        if (!previousRiskTitles.includes(risk.title)) {
            changeType = "New";
        }

        container.appendChild(
            createCard(`
                ${
                    changeType
                        ? `
                        <div class="risk-header">
                            <span class="
                                risk-change
                                new
                            ">
                                ${changeType}
                            </span>
                        </div>
                    `
                        : ""
                }
                <h3>${risk.title}</h3>
                <p><strong>Impact:</strong>
                    ${risk.impact}</p>
                <p><strong>State:</strong>
                    ${risk.state}</p>
                <p><strong>Attention:</strong>
                    ${risk.attention}</p>
                ${
                    riskAge
                        ? `
                            <p>
                                <strong>Age:</strong>
                                ${riskAge} snapshot(s)
                            </p>
                        `
                        : ""
                }
                <div class="dependencies-section">
                    <span class="dependency-label">
                        Mitigation
                    </span>
                    <p>
                        ${risk.mitigation.description}
                    </p>
                    <div class="dependency-pill">
                        ${risk.mitigation.status}
                    </div>
                </div>
            `)
        );
    });
}