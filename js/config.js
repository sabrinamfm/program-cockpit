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

function showLoading(message = "Loading…") {
	let el = document.getElementById("app-loading");

	if (!el) {
		el = document.createElement("div");
		el.id = "app-loading";
		el.style.position = "fixed";
		el.style.top = "16px";
		el.style.right = "16px";
		el.style.zIndex = "1000";
		el.style.borderRadius = "8px";
		el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
		document.body.appendChild(el);
	}

	el.innerText = message;
	el.style.background = "#EFF6FF";
	el.style.color = "#1E3A8A";
	el.style.padding = "8px 12px";
	el.style.fontWeight = "600";
}

function clearLoading() {
	const el = document.getElementById("app-loading");

	if (el) {
		el.remove();
	}
}