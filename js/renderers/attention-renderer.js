function renderAttentionQueue(items) {
    const container = document.getElementById("attention-container");

    container.innerHTML = "";

    items.forEach((item) => {
        const attentionClass = item.priority.toLowerCase().replace(/\s/g, "-");

        const card = createCard(`
            <div class="attention-header">
                <span class="
                    attention-badge
                    ${attentionClass}
                ">
                    ${item.priority}
                </span>
            </div>
            <h3>
                ${item.entity.title}
            </h3>
            <p>
                <strong>Type:</strong>
                ${item.entityType}
            </p>
            ${
                item.entity.owner
                    ? `
                        <p>
                            <strong>Owner:</strong>
                            ${item.entity.owner}
                        </p>
                    `
                    : ""
            }

            <p>
                ${item.reason}
            </p>
        `);
        container.appendChild(card);
    });
}