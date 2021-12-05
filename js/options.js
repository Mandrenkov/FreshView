// This script initializes the options UI.
// -----------------------------------------------------------------------------

// Reloads a widget when its state is modified in browser storage.
function onStorageChangedListener(changes, _) {
    const changed = widgets.filter(widget => widget.storage_key in changes);
    changed.forEach(widget => widget.load());
}

const widgets = [
    // Appearance
    new DarkModeWidget2(),
    // Filters (Types)
    new HideRecommendationsWidget(),
    new HidePlaylistsWidget(),
    new HideSearchesWidget(),
    new HideChannelsWidget(),
    // Filters (Pages)
    new HideHomeWidget(),
    new HideExploreWidget(),
    new HideSubscriptionsWidget(),
    new HideLibraryWidget(),
    new HideHistoryWidget()
];

// Initialize the UI widgets and register an event listener to update them when
// a relevant change in the browser storage is detected.
document.addEventListener("DOMContentLoaded", () => {
    widgets.forEach(widget => widget.init());
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