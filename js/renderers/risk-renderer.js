function renderRisks(currentRisks, previousRisks, availableSnapshots, currentSnapshot) {
    const container = document.getElementById("risks-container");

    container.innerHTML = "";

    const previousRiskTitles = previousRisks.map((risk) => risk.title);

    currentRisks.forEach((risk) => {
        let changeType = "";
        const riskAge = calculateRiskAge(risk, availableSnapshots);
        const relatedEntities = resolveRelationships(risk.relationships, currentSnapshot);
        const statusClass = risk.state.toLowerCase().replace(/\s+/g,"-");
        const mitigationClass = risk.mitigation.status.toLowerCase().replace(/\s+/g,"-");
        
        if (!previousRiskTitles.includes(risk.title)) {
            changeType = "New";
        }

        const relationshipHtml = relatedEntities.length > 0
        ? `
            <div class="
                relationship-section
            ">
                <strong>
                    Impacts
                </strong>

                <ul class="
                    relationship-list
                ">
                    ${relatedEntities
                        .map(
                            (entity) => `
                                <li>
                                    ${entity.id}: ${entity.title}
                                </li>
                            `
                        )
                        .join("")}
                </ul>
            </div>
        `
        : "";

        container.appendChild(
            createCard(`
                ${
                    changeType
                        ? 
                        `
                        <div class="risk-header">
                            <h3>${risk.title}</h3>
                            <span class="risk-change risk-${statusClass}">
                                ${changeType}
                            </span>
                            <span class="risk-change risk-${statusClass}">
                                ${statusClass}
                            </span>
                        </div>
                        `
                        :
                        `
                        <div class="risk-header">
                            <h3>${risk.title}</h3>
                            <span class="risk-change risk-${statusClass}">
                                ${statusClass}
                            </span>
                        </div>
                        `
                }

                ${relationshipHtml}

                <div class="dependencies-section">
                    <strong>
                        Mitigation
                    </strong>
                    <p>
                        ${risk.mitigation.description}
                    </p>

                    <div class="mitigation-status-wrapper">
                        <span class="mitigation-pill mitigation-${mitigationClass}">
                            ${risk.mitigation.status}
                        </span>
                    </div>
                </div>
            `)
        );
    });
}