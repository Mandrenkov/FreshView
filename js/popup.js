// This script initializes the FreshView UI.
// -----------------------------------------------------------------------------

// Propagates browser storage change events to their corresponding UI widgets.
function onStorageChangedListener(changes, _) {
    if ("dark-mode-checkbox-state" in changes) {
        const checkbox = document.getElementById("dark-mode-checkbox");
        const value = changes["dark-mode-checkbox-state"]["newValue"];
        if (checkbox.checked !== value) {
            checkbox.checked = value;
            const event = new Event("change");
            checkbox.dispatchEvent(event);
        }
    }
    if ("hide-videos-checkbox-state" in changes) {
        const bookmark = document.getElementById("hide-videos-bookmark");
        const checkbox = document.getElementById("hide-videos-checkbox");
        const value = changes["hide-videos-checkbox-state"]["newValue"];
        if (!bookmark.checked && checkbox.checked !== value) {
            checkbox.checked = value;
            const event = new Event("change");
            checkbox.dispatchEvent(event);
        }
    }
    if ("hide-videos-bookmarks" in changes) {
        const callback = (tabs) => {
            const page = Path.parseURL(tabs[0].url);
            const bookmark = document.getElementById("hide-videos-bookmark");
            const value = changes["hide-videos-bookmarks"]["newValue"][page];
            if (bookmark.checked !== (value !== undefined)) {
                bookmark.checked = value !== undefined;
                const event = new Event("change");
                bookmark.dispatchEvent(event);
            }
        };
        chrome.tabs.query({active: true, lastFocusedWindow: true}, callback);
    }
    if ("view-threshold-checkbox-state" in changes) {
        const checkbox = document.getElementById("view-threshold-checkbox");
        const value = changes["view-threshold-checkbox-state"]["newValue"];
        if (checkbox.checked !== value) {
            checkbox.checked = value;
            const event = new Event("change");
            checkbox.dispatchEvent(event);
        }
    }
    if ("view-threshold-slider-value" in changes) {
        const slider = document.getElementById("view-threshold-slider");
        const value = changes["view-threshold-slider-value"]["newValue"];
        if (slider.value !== value) {
            slider.value = value;
            const event = new Event("mouseup");
            slider.dispatchEvent(event);
        }
    }
}

// Updates the states of the UI widgets when the URL of the active tab changes.
function onTabUpdatedListener({}, changes, {}) {
    if (changes.url) {
        [DarkModeWidget, HideVideosWidget, ViewThresholdWidget].forEach(widget => widget.restore());
    }
}

// -----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    widgets = [DarkModeWidget, HideVideosWidget, OptionsWidget, ViewThresholdWidget];
    widgets.forEach(widget => widget.init());

    // Update these widgets when:
    //   1. An external storage change event fires.
    //   2. The URL of the active tab changes.
    chrome.storage.onChanged.addListener(onStorageChangedListener);
    chrome.tabs.onUpdated.addListener(onTabUpdatedListener);
});

// Keep the CSS transitions instantaneous for the first animation frame to give
// the browser a chance to instantly load the correct state.  Afterwards, apply
// the intended CSS transition durations.
window.requestAnimationFrame(_ => window.requestAnimationFrame(_ => {
    const root = document.documentElement.style;
    root.setProperty("--transition-duration-colour", Manager.DEFAULT_COLOUR_TRANSITION_DURATION);
    root.setProperty("--transition-duration-slider", Manager.DEFAULT_SLIDER_TRANSITION_DURATION);
    root.setProperty("--transition-duration-toggle", Manager.DEFAULT_TOGGLE_TRANSITION_DURATION);
}));