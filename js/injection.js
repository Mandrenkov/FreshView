// This script implements listeners for the Chrome storage API and is executed
// when the user navigates to a page on YouTube.
// -----------------------------------------------------------------------------

// Execution entry point.
function main() {
    // Activate the extension icon in the Chrome toolbar.
    chrome.runtime.sendMessage({type: "showPageAction"});
    // Add a listener for Chrome storage change events.
    chrome.storage.onChanged.addListener(onStorageChangedListener);
}

// Listens to Chrome storage change events.
function onStorageChangedListener(changes, namespace) {
    console.post("onStorageChangedListener(): Processing event in namespace \"" + namespace + "\":", changes, ".");

    const expected = namespace == "sync" || namespace == "local";
    if (!expected) {
        console.post("onStorageChangedListener(): Failed to process event: unexpected namespace \"%s\".", namespace);
        return;
    }

    const handled = hideListener(changes) || thresholdListener(changes);
    if (!handled) {
       console.post("onStorageChangedListener(): Failed to process event: no keys matched", changes, ".");
    }
}

// Listens for events related to the "Hide Videos" checkbox.
function hideListener(changes) {
    return listenerWrapper("hide", changes, (hidden) => {
        manager.hidden = hidden;
        manager.refreshVideos();
    });
}

// Listens for events related to the "View Threshold" slider.
function thresholdListener(changes) {
    return listenerWrapper("threshold", changes, (threshold) => {
        manager.threshold = threshold;
    });
}

// Wrapper function that implements a Manager listener flow.
function listenerWrapper(key, changes, callback) {
    const handled = key in changes;
    if (handled) {
        const value = changes[key].newValue;
        manager.stop();
        callback(value);
        manager.start();
    }
    return handled;
}

// -----------------------------------------------------------------------------

// Toggles the display of debug messages.
const DEBUG = false;

// Forwards the given arguments to console.log() if debug mode is enabled.
console.post = (...args) => { if (DEBUG) console.log(...args) };

// Construct the Manager singleton.
const manager = new Manager();

main();