function renderOKRs(relatedOKRs = []) {
    const container =
        document.getElementById(
            "okr-container"
        );

    container.innerHTML = "";

    if (
        !relatedOKRs ||
        relatedOKRs.length === 0
    ) {
        return;
    }

    const section =
        document.createElement("div");

    section.className =
        "related-okrs";

    section.innerHTML = `
        <h3 class="section-subtitle">
            Related OKRs
        </h3>

        <div class="okr-reference-list">
            ${relatedOKRs
                .map((okr) => {
                    const safeOKR = okr || {};
                    const status = safeOKR.status || "Unknown";
                    const statusClass =
                        status
                            .toLowerCase()
                            .replace(
                                /\s+/g,
                                "-"
                            );

                    return `
                        <div class="okr-reference">
                            <div class="okr-id">
                                ${escapeHtml(safeOKR.id || "N/A")}
                            </div>
                            <div class="okr-objective">
                                ${escapeHtml(safeOKR.objective || "Untitled objective")}
                            </div>
                            <div class="okr-status-wrapper">
                                <span class="
                                    okr-status-badge
                                    okr-${statusClass}
                                ">
                                    ${escapeHtml(status)}
                                </span>
                            </div>
                        </div>
                    `;
                })
                .join("")}
        </div>
    `;

    container.appendChild(
        section
    );
}