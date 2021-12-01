// This script initializes the options UI.
// -----------------------------------------------------------------------------

// Propagates browser storage change events to their corresponding UI widgets.
function onStorageChangedListener(changes, _) {
    // TODO: Implement this.
}

// -----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    // TODO: Set dark mode based on the value in browser storage.
    Storage.get({"dark-mode-checkbox-state": Manager.DEFAULT_DARK_MODE_CHECKBOX_STATE}, (values) => {
        // const theme = values["dark-mode-checkbox-state"] ? "dark" : "light";
        const theme = "dark";
        document.documentElement.setAttribute("data-theme", theme);
    });

    // TODO: Update any widgets when an external storage change event fires.
    // chrome.storage.onChanged.addListener(onStorageChangedListener);
});

// Keep the CSS transitions instantaneous for the first animation frame to give
// the browser a chance to instantly load the correct state. Afterwards, apply
// the intended CSS transition durations.
window.requestAnimationFrame(_ => window.requestAnimationFrame(_ => {
    const root = document.documentElement.style;
    root.setProperty("--transition-duration-colour", Manager.DEFAULT_COLOUR_TRANSITION_DURATION);
    root.setProperty("--transition-duration-slider", Manager.DEFAULT_SLIDER_TRANSITION_DURATION);
    root.setProperty("--transition-duration-toggle", Manager.DEFAULT_TOGGLE_TRANSITION_DURATION);
}));