// This script implements listeners for the browser storage API and is executed
// when the user navigates to a page on YouTube.
// -----------------------------------------------------------------------------

// Execution entry point.
function main() {
    // Activate the extension icon in the browser toolbar.
    chrome.runtime.sendMessage({type: "showPageAction"});
    // Add a listener for Chrome storage change events.
    chrome.storage.onChanged.addListener(onStorageChangedListener);
}

// Listens to browser storage change events.
function onStorageChangedListener(changes, namespace) {
    Logger.info("onStorageChangedListener(): processing event in namespace \"" + namespace + "\":", changes, ".");
    if (!(namespace == "sync" || namespace == "local")) {
        Logger.warning("onStorageChangedListener(): unexpected namespace \"%s\".", namespace);
    } else {
        const handled = hideVideosCheckboxListener(changes) | viewThresholdCheckboxListener(changes) | viewThresholdSliderListener(changes);
        if (!handled) {
            Logger.warning("onStorageChangedListener(): no keys matched", changes, ".");
        }
    }
}

// Listens for events related to the "Hide Videos" checkbox.
function hideVideosCheckboxListener(changes) {
    return listenerWrapper("hide-videos-checkbox-state", changes, hidden => {
        manager.hidden = hidden;
        manager.refresh();
    });
}

// Listens for events related to the "View Threshold" checkbox.
function viewThresholdCheckboxListener(changes) {
    return listenerWrapper("view-threshold-checkbox-state", changes, enabled => {
        manager.view_threshold_checkbox_state = enabled;
        manager.threshold = enabled ? manager.view_threshold_slider_value : 100;
        manager.request();
    });
}

// Listens for events related to the "View Threshold" slider.
function viewThresholdSliderListener(changes) {
    return listenerWrapper("view-threshold-slider-value", changes, value => {
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