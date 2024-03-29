// This content script initializes the Manager singleton and registers listeners
// for browser message and storage events.
// -----------------------------------------------------------------------------

/**
 * Listens to browser message events which indicate that one of the following
 * events associated with the page corresponding to the running instance of the
 * content script has occurred:
 *
 * 1. The URL of the page has changed.
 * 2. The popup script has issued a page filter query.
 *
 * @see https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
 */
function onMessageListener(request, {}, sendResponse) {
    Logger.debug(`onMessageListener(): received "${request.message}" message.`);
    if (request.message === URL_CHANGE_MESSAGE) {
        manager.display();
    } else if (request.message === PAGE_FILTER_QUERY_MESSAGE) {
        manager.settings.load(() => sendResponse(manager.settings.ignored()));
        // Indicate that sendResponse() will be invoked asynchronously.
        return true;
    }
};

/**
 * Listens for storage change events which indicate that the current state
 * of the Settings object is outdated.
 *
 * @see https://developer.chrome.com/docs/extensions/reference/storage/#event-onChanged
 */
function onStorageChangedListener(changes, {}) {
    Logger.debug("onStorageChangedListener(): changed", changes, ".");
    const keys = Array.from(Object.keys(SETTINGS_DEFAULT_STATE));
    if (keys.some(key => changes.hasOwnProperty(key))) {
        manager.settings.load(() => manager.request());
    }
}

// -----------------------------------------------------------------------------

const manager = new Manager();

chrome.runtime.onMessage.addListener(onMessageListener);
chrome.storage.onChanged.addListener(onStorageChangedListener);

// Activate the extension icon in the browser toolbar.
chrome.runtime.sendMessage({type: "showPageAction"});
