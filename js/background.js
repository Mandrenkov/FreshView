// This script monitors background events.  All it currently does is activate
// the FreshView extension in the Chrome toolbar.
// -----------------------------------------------------------------------------

// Add a listener to activate the extension icon in the Chrome toolbar.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "showPageAction") {
        chrome.pageAction.show(sender.tab.id);
    }
});