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