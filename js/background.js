// This script monitors background events.  Specifically, it activates the
// extension in the browser toolbar and processes keyboard shortcuts.
// -----------------------------------------------------------------------------

// Activates the extension icon in the browser toolbar.
function onMessageListener(message, sender, _) {
    if (message.type === "showPageAction") {
        chrome.pageAction.show(sender.tab.id);
    }
}

// Add a listener to activate the extension icon in the browser toolbar.
chrome.runtime.onMessage.addListener(onMessageListener);

// Add a listener for browser command events (i.e., keyboard shortcuts).
chrome.commands.onCommand.addListener(command => {
    // Toggles the Boolean value of an item in storage if it exists.
    const toggle = (key) => {
        Storage.get({[key]: undefined}, values => {
            const value = values[[key]];
            if (value !== undefined) {
                Storage.set({[key]: !value});
            }
        });
    }
    if (command === "toggle-hide-videos-checkbox") {
        toggle("hide-videos-checkbox-state");
    } else if (command === "toggle-view-threshold-checkbox") {
        toggle("view-threshold-checkbox-state");
    }
});