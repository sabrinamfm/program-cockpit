function renderOperationalInterfaces(
    interfaces
) {
    const container =
        document.getElementById(
            "interfaces-container"
        );

    container.innerHTML = "";

    const table =
        document.createElement(
            "table"
        );

    table.className =
        "interfaces-table";

    table.innerHTML = `
        <thead>
            <tr>
                <th>Team</th>
                <th>PoC</th>
                <th>Program Needs</th>
                <th>Team Needs</th>
            </tr>
        </thead>

        <tbody></tbody>
    `;

    const tbody =
        table.querySelector(
            "tbody"
        );

    interfaces.forEach(
        (item) => {
            const row =
                document.createElement(
                    "tr"
                );

            row.innerHTML = `
                <td>
                    ${item.team}
                </td>

                <td>
                    ${item.poc || "—"}
                </td>

                <td>
                    <ul>
                        ${item.programNeeds
                            .map(
                                (need) => `
                                    <li>
                                        ${need}
                                    </li>
                                `
                            )
                            .join("")}
                    </ul>
                </td>

                <td>
                    <ul>
                        ${item.teamNeeds
                            .map(
                                (need) => `
                                    <li>
                                        ${need}
                                    </li>
                                `
                            )
                            .join("")}
                    </ul>
                </td>
            `;

            tbody.appendChild(
                row
            );
        }
    );

    container.appendChild(
        table
    );
}