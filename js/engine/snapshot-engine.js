async function loadSnapshot(snapshotId, availableSnapshots) {
    clearError();

    try {
        showLoading(`Loading snapshot ${snapshotId}...`);

        const programResponse = await fetch("data/config/program.json");
        if (!programResponse.ok) throw new Error(`Failed to load program config: ${programResponse.status}`);

        const currentSnapshotResponse = await fetch(`data/snapshots/${snapshotId}.json`);
        if (!currentSnapshotResponse.ok) throw new Error(`Failed to load snapshot ${snapshotId}: ${currentSnapshotResponse.status}`);

        const currentSnapshot = await currentSnapshotResponse.json();

        const historicalSnapshots = [];

        for (const sId of availableSnapshots) {
            try {
                const response = await fetch(`data/snapshots/${sId}.json`);

                if (!response.ok) {
                    console.warn(`Failed to load historical snapshot ${sId}: ${response.status}`);
                    continue;
                }

                historicalSnapshots.push(await response.json());
            } catch (e) {
                console.warn(`Error loading historical snapshot ${sId}: ${e.message}`);
            }
        }

        const snapshotIndex = availableSnapshots.indexOf(snapshotId);
        const historicalSnapshotsThroughCurrent = historicalSnapshots.slice(0, snapshotIndex + 1);

        let previousSnapshot = {
            declaredDeliveryConfidence: currentSnapshot.declaredDeliveryConfidence,
            risks: [],
            milestones: [],
            dependencies: [],
            decisions: [],
            features: [],
            attentionQueue: []
        };

        if (snapshotIndex > 0) {
            const previousSnapshotId = availableSnapshots[snapshotIndex - 1];
            const previousSnapshotResponse = await fetch(`data/snapshots/${previousSnapshotId}.json`);

            if (!previousSnapshotResponse.ok) {
                console.warn(`Failed to load previous snapshot ${previousSnapshotId}: ${previousSnapshotResponse.status}`);
            } else {
                previousSnapshot = await previousSnapshotResponse.json();
            }
        }

        const program = await programResponse.json();

        clearLoading();
        renderProgram(program, currentSnapshot, previousSnapshot, availableSnapshots, historicalSnapshotsThroughCurrent);
    } catch (err) {
        console.error(err);
        clearLoading();
        showError(`Error loading snapshot ${snapshotId}: ${err.message}`);
    }
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
