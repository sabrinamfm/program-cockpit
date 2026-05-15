function detectConfidenceTrend(snapshots) {
    if (snapshots.length < 3) {
        return null;
    }

    const lastThree = snapshots.slice(-3);

    const isDecreasing =
        lastThree[0]
            .deliveryConfidence >
        lastThree[1]
            .deliveryConfidence &&
        lastThree[1]
            .deliveryConfidence >
        lastThree[2]
            .deliveryConfidence;

    if (!isDecreasing) {
        return null;
    }

    return {
        severity: "High",
        category: "Delivery Trend",
        message: "Delivery confidence decreased for 3 consecutive snapshots"
    };
}

function detectMilestoneDrift(currentMilestones, previousMilestones) {
    const warnings = [];

    currentMilestones.forEach(
        (currentMilestone) => {
            const previousMilestone = previousMilestones.find((milestone) => milestone.title === currentMilestone.title);

            if (!previousMilestone) {
                return;
            }

            const previousDate = new Date(previousMilestone.date);
            const currentDate = new Date(currentMilestone.date);
            const differenceInMs = currentDate - previousDate;
            const differenceInDays = Math.round(differenceInMs / (1000 * 60 * 60 * 24));

            if (differenceInDays <= 0) {
                return;
            }

            warnings.push({
                severity: "Medium",
                category: "Milestone Drift",
                message: `${currentMilestone.title} slipped by ${differenceInDays} day(s)`
            });
        }
    );

    return warnings;
}