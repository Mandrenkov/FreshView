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
        new DarkModeCheckbox(),

        // Filters (Types)
        new Checkbox(
            "hide-recommendations-checkbox",
            HIDE_RECOMMENDATIONS_CHECKBOX_STORAGE_KEY,
            HIDE_RECOMMENDATIONS_CHECKBOX_DEFAULT_STATE
        ),
        new Checkbox(
            "hide-playlists-checkbox",
            HIDE_PLAYLISTS_CHECKBOX_STORAGE_KEY,
            HIDE_PLAYLISTS_CHECKBOX_DEFAULT_STATE
        ),
        new Checkbox(
            "hide-searches-checkbox",
            HIDE_SEARCHES_CHECKBOX_STORAGE_KEY,
            HIDE_SEARCHES_CHECKBOX_DEFAULT_STATE
        ),
        new Checkbox(
            "hide-channels-checkbox",
            HIDE_CHANNELS_CHECKBOX_STORAGE_KEY,
            HIDE_CHANNELS_CHECKBOX_DEFAULT_STATE
        ),

        // Filters (Pages)
        new Checkbox(
            "hide-home-checkbox",
            HIDE_HOME_CHECKBOX_STORAGE_KEY,
            HIDE_HOME_CHECKBOX_DEFAULT_STATE
        ),
        new Checkbox(
            "hide-explore-checkbox",
            HIDE_EXPLORE_CHECKBOX_STORAGE_KEY,
            HIDE_EXPLORE_CHECKBOX_DEFAULT_STATE
        ),
        new Checkbox(
            "hide-subscriptions-checkbox",
            HIDE_SUBSCRIPTIONS_CHECKBOX_STORAGE_KEY,
            HIDE_SUBSCRIPTIONS_CHECKBOX_DEFAULT_STATE
        ),
        new Checkbox(
            "hide-library-checkbox",
            HIDE_LIBRARY_CHECKBOX_STORAGE_KEY,
            HIDE_LIBRARY_CHECKBOX_DEFAULT_STATE
        ),
        new Checkbox(
            "hide-history-checkbox",
            HIDE_HISTORY_CHECKBOX_STORAGE_KEY,
            HIDE_HISTORY_CHECKBOX_DEFAULT_STATE
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