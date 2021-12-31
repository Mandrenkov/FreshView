// This script initializes the popup UI.
// -----------------------------------------------------------------------------

// Updates the states of the UI widgets when the URL of the current tab changes.
function onTabUpdatedListener({}, changes, {}) {
    if (changes.url) {
        widgets.forEach(widget => widget.load());
    }
}

// -----------------------------------------------------------------------------

// Array of widgets appearing in the popup UI. Since widgets can only be
// instantiated after the DOM is loaded, the array is initially empty.
let widgets = [];

document.addEventListener("DOMContentLoaded", () => {
    // Browser extensions are prohibited from embedding JavaScript in the
    // "on_click" properties of their HTML elements.
    const options = document.getElementById("options-span");
    options.addEventListener("click", () => chrome.runtime.openOptionsPage());

    widgets = [
        // Dark Theme
        new DarkModeCheckbox(),

        // Hide Videos
        new HideVideosCheckbox(),
        new HideVideosBookmark(),

        // View Threshold
        new ViewThresholdCheckbox(),
        new ViewThresholdSlider(),
        new ViewThresholdLabel()
    ]

    // Update these widgets when the URL of the current tab changes.
    chrome.tabs.onUpdated.addListener(onTabUpdatedListener);
});

// Keep the CSS transitions instantaneous for the first animation frame to give
// the browser a chance to instantly load the correct state.  Afterwards, apply
// the intended CSS transition durations.
window.requestAnimationFrame(_ => window.requestAnimationFrame(_ => {
    const root = document.documentElement.style;
    root.setProperty("--transition-duration-colour", "0.2s");
    root.setProperty("--transition-duration-slider", "0.4s");
    root.setProperty("--transition-duration-toggle", "0.4s");
}));