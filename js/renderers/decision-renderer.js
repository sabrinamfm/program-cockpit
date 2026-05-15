function renderDecisions(decisions) {
    const container = document.getElementById("decisions-container");

    container.innerHTML = "";

    decisions.forEach((decision) => {
        container.appendChild(
            createCard(`
                <h3>${decision.title}</h3>
                <p>${decision.description}</p>
            `)
        );
    });
}