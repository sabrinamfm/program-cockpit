function renderOKRs(
    relatedOKRs
) {
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
                    const statusClass =
                        okr.status
                            .toLowerCase()
                            .replace(
                                /\s+/g,
                                "-"
                            );

                    return `
                        <div class="okr-reference">
                            <strong>
                                ${okr.id}
                            </strong>
                            <span>
                                ${okr.objective}
                            </span>
                            <span class="
                                okr-status-badge
                                okr-${statusClass}
                            ">
                                ${okr.status}
                            </span>
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