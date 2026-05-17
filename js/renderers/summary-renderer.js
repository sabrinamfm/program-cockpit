function renderWeeklySummary(summary = { highlights: [], lowlights: [] }) {
    const highlights = document.getElementById("highlights-list");
    const lowlights = document.getElementById("lowlights-list");

    highlights.innerHTML = "";
    lowlights.innerHTML = "";

    (summary.highlights || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item || "—";
        highlights.appendChild(li);
    });

    (summary.lowlights || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item || "—";
        lowlights.appendChild(li);
    });
}