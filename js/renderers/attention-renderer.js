function renderAttentionQueue(items) {
    const container = document.getElementById("attention-container");

    container.innerHTML = "";

    items.forEach((item) => {
        const attentionClass = item.type.toLowerCase().replace(/\s/g, "-");

        container.appendChild(
            createCard(`
                <div class="attention-header">
                    <span class="
                        attention-badge
                        ${attentionClass}
                    ">
                        ${item.type}
                    </span>
                </div>
                <h3>${item.title}</h3>
                <p>
                    <strong>Owner:</strong>
                    ${item.owner}
                </p>
                <p class="attention-reason">
                    ${item.reason}
                </p>
            `)
        );
    });
}