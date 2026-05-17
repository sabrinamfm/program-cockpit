let uiConfig = {};

function showError(message) {
	let el = document.getElementById("app-error");

	if (!el) {
		el = document.createElement("div");
		el.id = "app-error";
		el.style.position = "fixed";
		el.style.top = "16px";
		el.style.left = "50%";
		el.style.transform = "translateX(-50%)";
		el.style.zIndex = "1000";
		el.style.maxWidth = "90%";
		el.style.borderRadius = "8px";
		el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
		document.body.appendChild(el);
	}

	el.innerText = message;
	el.style.background = "#fee2e2";
	el.style.color = "#7f1d1d";
	el.style.padding = "12px 16px";
	el.style.fontWeight = "600";
}

function clearError() {
	const el = document.getElementById("app-error");

	if (el) {
		el.remove();
	}
}