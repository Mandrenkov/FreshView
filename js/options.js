// This script initializes the options UI.
// -----------------------------------------------------------------------------

// Reloads a widget when its state is modified in browser storage.
function onStorageChangedListener(changes, _) {
    const changed = widgets.filter(widget => widget.storage_key in changes);
    changed.forEach(widget => widget.load());
}

// Array of widgets appearing in the options UI. Since widgets can only be
// instantiated after the DOM is loaded, the array is initially empty.
let widgets = [];

// Initialize the UI widgets and register an event listener to update them when
// a relevant change in the browser storage is detected.
document.addEventListener("DOMContentLoaded", () => {
    widgets = [
        // Appearance
        new DarkModeWidget2(),

        // Filters (Types)
        new Checkbox(
            "hide-recommendations-checkbox",
            "hide-recommendations-checkbox-state",
            true,
        ),
        new Checkbox(
            "hide-playlists-checkbox",
            "hide-playlists-checkbox-state",
            true,
        ),
        new Checkbox(
            "hide-searches-checkbox",
            "hide-searches-checkbox-state",
            true,
        ),
        new Checkbox(
            "hide-channels-checkbox",
            "hide-channels-checkbox-state",
            true,
        ),

        // Filters (Pages)
        new Checkbox(
            "hide-home-checkbox",
            "hide-home-checkbox-state",
            true,
        ),
        new Checkbox(
            "hide-explore-checkbox",
            "hide-explore-checkbox-state",
            true,
        ),
        new Checkbox(
            "hide-subscriptions-checkbox",
            "hide-subscriptions-checkbox-state",
            true,
        ),
        new Checkbox(
            "hide-library-checkbox",
            "hide-library-checkbox-state",
            true,
        ),
        new Checkbox(
            "hide-history-checkbox",
            "hide-history-checkbox-state",
            false,
        ),
    ];

    chrome.storage.onChanged.addListener(onStorageChangedListener);
});

// Keep the CSS transitions instantaneous for the first animation frame to give
// the browser a chance to instantly load the correct state. Afterwards, apply
// the intended CSS transition durations.
window.requestAnimationFrame(_ => window.requestAnimationFrame(_ => {
    const root = document.documentElement.style;
    root.setProperty("--transition-duration-colour", "0.2s");
    root.setProperty("--transition-duration-slider", "0.4s");
    root.setProperty("--transition-duration-toggle", "0.4s");
}));