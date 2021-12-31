// This script implements listeners for the browser storage API and is executed
// when the user navigates to a page on YouTube.
// -----------------------------------------------------------------------------

// Execution entry point.
function main() {
    // Activate the extension icon in the browser toolbar.
    chrome.runtime.sendMessage({type: "showPageAction"});
    // Add a listener for Chrome messages and storage change events.
    chrome.runtime.onMessage.addListener(onMessageListener);
    chrome.storage.onChanged.addListener(onStorageChangedListener);
}

// -----------------------------------------------------------------------------

// Listens to browser storage change events.
function onMessageListener(request, _sender, _sendResponse) {
    // Listen for "restore" messages sent from background.js.
    if (request.message === "restore") {
        Logger.info("onMessageListener(): received \"restore\" message.");
        manager.restore();
    }
};

// -----------------------------------------------------------------------------

// Listens to browser storage change events.
function onStorageChangedListener(changes, namespace) {
    Logger.info("onStorageChangedListener(): processing event in namespace \"" + namespace + "\":", changes, ".");
    if (namespace != "sync" && namespace != "local") {
        Logger.warning(`onStorageChangedListener(): unexpected namespace "${namespace}".`);
    } else {
        const handled = darkModeCheckboxListener(changes) |
                        hideVideosCheckboxListener(changes) | hideVideosBookmarkListener(changes) |
                        viewThresholdCheckboxListener(changes) | viewThresholdSliderListener(changes);
        if (!handled) {
            Logger.warning(`onStorageChangedListener(): no keys matched ${JSON.stringify(changes)}.`);
        }
    }
}

// Listens for events related to the "Dark Mode" checkbox.
function darkModeCheckboxListener(changes) {
    return "dark-mode-checkbox-state" in changes;
}

// Listens for events related to the "Hide Videos" checkbox.
function hideVideosCheckboxListener(changes) {
    return listenerWrapper("hide-videos-checkbox-state", changes, (checked) => {
        manager.hide_videos_checkbox_state = checked;
        if (manager.hide_videos_bookmark_state === undefined) {
            manager.hidden = checked;
            manager.refresh();
        }
    });
}

// Listens for events related to the "Hide Videos" bookmark.
function hideVideosBookmarkListener(changes) {
    return listenerWrapper("hide-videos-bookmarks", changes, (bookmarks) => {
        const page = Path.parse(window.location.toString());
        manager.hide_videos_bookmark_state = bookmarks[page];
        manager.hidden = manager.hide_videos_bookmark_state !== undefined ? manager.hide_videos_bookmark_state : manager.hide_videos_checkbox_state;
        manager.refresh();
    });
}

// Listens for events related to the "View Threshold" checkbox.
function viewThresholdCheckboxListener(changes) {
    return listenerWrapper("view-threshold-checkbox-state", changes, (checked) => {
        manager.view_threshold_checkbox_state = checked;
        manager.threshold = checked ? manager.view_threshold_slider_value : 100;
        manager.request();
    });
}

// Listens for events related to the "View Threshold" slider.
function viewThresholdSliderListener(changes) {
    return listenerWrapper("view-threshold-slider-value", changes, (value) => {
        manager.view_threshold_slider_value = value;
        manager.threshold = manager.view_threshold_checkbox_state ? value : 100;
        manager.request();
    });
}

// Wrapper function that implements a Manager listener flow.
function listenerWrapper(key, changes, callback) {
    const handled = key in changes;
    if (handled) {
        const value = changes[key].newValue;
        callback(value);
    }
    return handled;
}

// -----------------------------------------------------------------------------

// The (singleton) Manager instance.
const manager = new Manager();

main();