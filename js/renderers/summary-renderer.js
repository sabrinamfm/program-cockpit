function renderWeeklySummary(summary) {
    const highlights = document.getElementById("highlights-list");
    const lowlights = document.getElementById("lowlights-list");

    highlights.innerHTML = "";
    lowlights.innerHTML = "";

    summary.highlights.forEach(
        (item) => {
            highlights.innerHTML += `
                <li>${item}</li>
            `;
        }
    );

    summary.lowlights.forEach(
        (item) => {
            lowlights.innerHTML += `
                <li>${item}</li>
            `;
        }
    );
}