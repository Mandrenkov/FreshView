// This script monitors background events.  Specifically, it activates the
// extension in the browser toolbar, processes keyboard shortcuts, and
// notifies content scripts of changes to the active tab URL.
// -----------------------------------------------------------------------------

// Activates the extension icon in the browser toolbar.
function onMessageListener(message, sender, _sendResponse) {
    if (message.type === "showPageAction") {
        chrome.pageAction.show(sender.tab.id);
    }
}

// Processes keyboard shortcuts using the browser storage API.
function onCommandListener(command) {
    // Toggles the value associated with the given key in storage.
    const toggle = (key, fallback) => {
        Storage.get({[key]: fallback}, (values) => Storage.set({[key]: !values[key]}));
    }
    if (command === "toggle-hide-videos-checkbox") {
        toggle("hide-videos-checkbox-state", Manager.DEFAULT_HIDE_VIDEOS_CHECKBOX_STATE);
    } else if (command === "toggle-view-threshold-checkbox") {
        toggle("view-threshold-checkbox-state", Manager.DEFAULT_VIEW_THRESHOLD_CHECKBOX_STATE);
    }
};

// Sends a message to a content script when the URL of its active tab changes.
function onTabUpdatedListener(tabID, changes, _tab){
    if (changes.url) {
        chrome.tabs.sendMessage(tabID, {message: "restore"});
    }
};


// Register the listeners with their corresponding triggers.
chrome.runtime.onMessage.addListener(onMessageListener);
chrome.commands.onCommand.addListener(onCommandListener);
chrome.tabs.onUpdated.addListener(onTabUpdatedListener);