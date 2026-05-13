const milestones = [
    {
        title: "Specification Approval",
        date: "2026-06-15",
        status: "At Risk"
    },
    {
        title: "Configuration Validation",
        date: "2026-07-10",
        status: "On Track"
    },
    {
        title: "Customer Delivery",
        date: "2026-09-30",
        status: "At Risk"
    }
];

const features = [
    {
        title: "Customer Configuration Flow",
        estimate: "5 weeks",
        owner: "Platform Team",
        status: "In Progress"
    },
    {
        title: "Reporting Dashboard",
        estimate: "3 weeks",
        owner: "Analytics Team",
        status: "Planned"
    }
];

const risks = [
    {
        title: "Specification still under discussion",
        impact: "High",
        mitigation: "Parallel validation and early alignment meetings."
    },
    {
        title: "External configuration dependency",
        impact: "Medium",
        mitigation: "Escalation path identified."
    }
];

function createCard(content) {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = content;

    return div;
}

const milestonesContainer = document.getElementById("milestones-container");

const timeline = document.createElement("div");
timeline.className = "timeline";

milestones.forEach((milestone) => {
    const item = document.createElement("div");

    item.className = "timeline-item";

    const statusClass =
        milestone.status === "On Track"
            ? "on-track"
            : "at-risk";

    item.innerHTML = `
        <div class="timeline-marker ${statusClass}"></div>

        <div class="timeline-content">
            <h3>${milestone.title}</h3>

            <p>${milestone.date}</p>

            <span class="status ${statusClass}">
                ${milestone.status}
            </span>
        </div>
    `;

    timeline.appendChild(item);
});

milestonesContainer.appendChild(timeline);

const featuresContainer = document.getElementById("features-container");

features.forEach((feature) => {
    featuresContainer.appendChild(
        createCard(`
            <h3>${feature.title}</h3>

            <p><strong>Estimate:</strong> ${feature.estimate}</p>
            <p><strong>Owner:</strong> ${feature.owner}</p>
            <p><strong>Status:</strong> ${feature.status}</p>
        `)
    );
});

const risksContainer = document.getElementById("risks-container");

risks.forEach((risk) => {
    risksContainer.appendChild(
        createCard(`
            <h3>${risk.title}</h3>

            <p><strong>Impact:</strong> ${risk.impact}</p>
            <p><strong>Mitigation:</strong> ${risk.mitigation}</p>
        `)
    );
});

document.getElementById("last-updated").innerText =
    new Date().toLocaleDateString();