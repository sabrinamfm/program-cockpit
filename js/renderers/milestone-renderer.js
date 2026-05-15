function renderMilestones(milestones) {
    const container = document.getElementById("milestones-container");
    container.innerHTML = "";

    const timeline = document.createElement("div");
    timeline.className = "horizontal-timeline";

    milestones.forEach((milestone) => {
        const item = document.createElement("div");

        const statusClass = milestone.status === "On Track" ? "on-track" : "at-risk";

        item.className = "horizontal-timeline-item";

        item.innerHTML = `
            <div class="
                horizontal-marker
                ${statusClass}
            "></div>

            <div class="horizontal-content">
                <h3>${milestone.title}</h3>
                <p>${milestone.date}</p>
                <span class="status ${statusClass}">
                    ${milestone.status}
                </span>
            </div>
        `;
        timeline.appendChild(item);
    });
    container.appendChild(timeline);
}