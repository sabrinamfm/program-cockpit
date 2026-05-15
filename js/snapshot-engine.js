async function loadSnapshot(snapshotId, availableSnapshots) {
    const programResponse = await fetch("data/config/program.json");
    const currentSnapshotResponse = await fetch(`data/snapshots/${snapshotId}.json`);
    const currentSnapshot = await currentSnapshotResponse.json();

    const historicalSnapshots = [];

    for (const snapshotId of availableSnapshots) {
        const response = await fetch(`data/snapshots/${snapshotId}.json`);

        historicalSnapshots.push(await response.json());
    }

    const snapshotIndex = availableSnapshots.indexOf(snapshotId);

    let previousSnapshot = {
        deliveryConfidence: currentSnapshot.deliveryConfidence
    };

    if (snapshotIndex > 0) {
        const previousSnapshotId = availableSnapshots[snapshotIndex - 1];
        const previousSnapshotResponse = await fetch(`data/snapshots/${previousSnapshotId}.json`);

        previousSnapshot = await previousSnapshotResponse.json();
    }

    const program = await programResponse.json();

    renderProgram(program, currentSnapshot, previousSnapshot, availableSnapshots, historicalSnapshots);
}

function renderSnapshotSelector(snapshots, latestSnapshot) {
    const selector = document.getElementById("snapshot-selector");

    selector.innerHTML = "";

    snapshots.forEach((snapshot) => {
        const option = document.createElement("option");
        option.value = snapshot;
        option.innerText = snapshot;

        if (snapshot === latestSnapshot) {
            option.selected = true;
        }

        selector.appendChild(option);
    });

    selector.addEventListener(
        "change",
        async (event) => {
            await loadSnapshot(
                event.target.value,
                snapshots
            );
        }
    );
}