// This script implements the Storage class.
// -----------------------------------------------------------------------------

// Storage wraps the browser local storage API.  The synced storage API is not
// used because it has restrictive quotas and is not permitted in the context
// of a temporary Firefox extension.
class Storage {
    // Gets the specified items from local storage and invokes the given callback.
    // The items must be an object which maps keys to their default values.
    // Likewise, the callback must accept an object with the same shape as input.
    static get(items, callback) {
        const decorator = (contents) => {
            if (chrome.runtime.lastError) {
                Logger.error(`Storage.get(): failed to get items ${items}: ${chrome.runtime.lastError.message}.`);
            } else {
                const values = {};
                for (const [key, value] of Object.entries(items)) {
                    values[key] = contents.hasOwnProperty(key) ? contents[key] : value;
                }
                callback(values);
            }
        }
        chrome.storage.local.get(Object.keys(items), decorator);
    }

    // Sets the specified items from local storage and invokes the given callback
    // if one is provided.  The items must be given in the form of an object.
    static set(items, callback) {
        const decorator = () => {
            if (chrome.runtime.lastError) {
                Logger.error(`Storage.set(): failed to set items ${items}: ${chrome.runtime.lastError.message}.`);
            } else if (callback !== undefined) {
                callback();
            }
        }
        chrome.storage.local.set(items, decorator);
    }
}