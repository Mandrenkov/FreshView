// This file contains listeners for background events which correspond to the
// following actions:
//
// 1. Activating the extension icon in the browser toolbar.
// 2. Processing keyboard shortcuts (and updating browser storage).
// 3. Notifying content scripts of changes to their tab URL.
// -----------------------------------------------------------------------------

/**
 * Processes keyboard shortcuts by modifying browser storage.
 *
 * @see https://developer.chrome.com/docs/extensions/reference/commands/#event-onCommand
 */
 function onCommandListener(command) {
    const toggleStateInBrowserStorage = (key, fallback) => {
        Storage.get({[key]: fallback}, values => Storage.set({[key]: !values[key]}));
    }

    if (command === "toggle-hide-videos-checkbox") {
        toggleStateInBrowserStorage(
            HIDE_VIDEOS_CHECKBOX_STORAGE_KEY,
            HIDE_VIDEOS_CHECKBOX_DEFAULT_STATE
        );

    } else if (command === "toggle-view-threshold-checkbox") {
        toggleStateInBrowserStorage(
            VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY,
            VIEW_THRESHOLD_CHECKBOX_DEFAULT_STATE
        );
    }
};

/**
 * Activates the extension icon in the browser toolbar.
 *
 * @see https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
 */
function onMessageListener(message, sender, _sendResponse) {
    if (message.type === "showPageAction") {
        chrome.pageAction.show(sender.tab.id);
    }
}

/**
 * Sends a message to a content script when the URL of its YouTube page changes.
 *
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/#event-onUpdated
 */
function onTabUpdatedListener(tabID, changes, _){
    if (changes.url) {
        chrome.tabs.sendMessage(tabID, {"message": URL_CHANGE_MESSAGE});
    }
};

// -----------------------------------------------------------------------------

chrome.commands.onCommand.addListener(onCommandListener);
chrome.runtime.onMessage.addListener(onMessageListener);
chrome.tabs.onUpdated.addListener(onTabUpdatedListener);