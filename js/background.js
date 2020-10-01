// This script monitors background events.  Specifically,it activates the
// extension in the browser toolbar and processes keyboard shortcuts.
// -----------------------------------------------------------------------------

// Add a listener to activate the extension icon in the browser toolbar.
chrome.runtime.onMessage.addListener((message, sender, _) => {
    if (message.type === "showPageAction") {
        chrome.pageAction.show(sender.tab.id);
    }
});

// Add a listener for browser command events (i.e., keyboard shortcuts).
chrome.commands.onCommand.addListener(command => {
    // Toggles the state of an item in the storage dictionary.
    function toggle(key) {
        chrome.storage.sync.get(key, items => {
            if (!chrome.runtime.lastError && items.hasOwnProperty(key)) {
                chrome.storage.sync.set({[key]: !items[key]});
            }
        });
    }

    if (command === "toggle-hide-videos-checkbox") {
        toggle("hide-videos-checkbox-state");
    } else if (command === "toggle-view-threshold-checkbox") {
        toggle("view-threshold-checkbox-state");
    }
});