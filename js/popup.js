// This script attaches event listeners to the FreshView UI.
// -----------------------------------------------------------------------------

// Initializes the event listeners for the "Hide Videos" checkbox.
function addCheckboxEventListener() {
    const checkbox = document.getElementById("hidebox");
    chrome.storage.sync.get("hide", items => updateCheckboxState(checkbox, items));
    checkbox.addEventListener("change", () => publishCheckboxState(checkbox));
}

// Initializes the event listeners for the "View Threshold" checkbox.
function addThresholdCheckboxEventListener() {
    const checkboxview = document.getElementById("viewbox");
    chrome.storage.sync.get("usethreshold", items => updateCheckboxvewState(checkboxview, items));
    checkboxview.addEventListener("change", () => publishCheckboxViewState(checkboxview));
}

// Updates the state of the given checkbox to reflect the synced "Hide Videos" checkbox state.
function updateCheckboxState(checkbox, items) {
    const valid = !chrome.runtime.lastError && items.hasOwnProperty("hide");
    checkbox.checked = valid ? items["hide"] : Manager.DEFAULT_HIDDEN;
}

// Updates the state of the given checkbox to reflect the synced "View Threshold" checkbox state.
function updateCheckboxvewState(checkbox, items) {
    const validView = !chrome.runtime.lastError && items.hasOwnProperty("usethreshold");
    checkbox.checked = validView ? items["usethreshold"] : Manager.DEFAULT_VIEW;
}

// Publishes the state of the given checkbox as the synced "Hide Videos" checkbox state.
function publishCheckboxState(checkbox) {
    chrome.storage.sync.set({ "hide": checkbox.checked });
}

// Publishes the state of the given checkbox as the synced "View Threshold" checkbox state.
function publishCheckboxViewState(checkbox) {
    chrome.storage.sync.set({ "usethreshold": checkbox.checked });
}

// -----------------------------------------------------------------------------

// Initializes the event listeners for the "View Threshold" slider.
function addSliderEventListener() {
    const slider = document.getElementById("slider");
    const percent = document.getElementById("percent");
    chrome.storage.sync.get("threshold", items => updateSliderState(slider, percent, items));
    // Limit the number of updates to the synced slider state to avoid exhausting the synced Chrome storage API quota.
    slider.addEventListener("input", () => publishSliderState(slider, percent, chrome.storage.local));
    slider.addEventListener("mouseup", () => publishSliderState(slider, percent, chrome.storage.sync));
}

// Updates the state of the given slider to reflect the synced "View Threshold" slider state.
function updateSliderState(slider, percent, items) {
    const valid = !chrome.runtime.lastError && items.hasOwnProperty("threshold");
    const value = valid ? items["threshold"] : Manager.DEFAULT_THRESHOLD;
    slider.value = value;
    percent.textContent = value + "%";
}

// Publishes the state of the given slider as the local or synced "View Threshold" slider state.
function publishSliderState(slider, percent, storage) {
    const value = slider.value;
    percent.textContent = value + "%";
    storage.set({ "threshold": value });
}

// -----------------------------------------------------------------------------

// Add the "Hide Videos" checkbox and "View Threshold" slider event listeners once the DOM is loaded.
document.addEventListener("DOMContentLoaded", () => {
    addCheckboxEventListener();
    addThresholdCheckboxEventListener();
    addSliderEventListener();
});