function initializeTabs() {
    const buttons =
        document.querySelectorAll(
            ".tab-button"
        );

    buttons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                const targetTab =
                    button.dataset.tab;

                document
                    .querySelectorAll(
                        ".tab-button"
                    )
                    .forEach((button) =>
                        button.classList.remove(
                            "active"
                        )
                    );

                document
                    .querySelectorAll(
                        ".tab-content"
                    )
                    .forEach((tab) =>
                        tab.classList.remove(
                            "active"
                        )
                    );

                button.classList.add(
                    "active"
                );

                document
                    .getElementById(
                        `tab-${targetTab}`
                    )
                    .classList.add(
                        "active"
                    );
            }
        );
    });
}