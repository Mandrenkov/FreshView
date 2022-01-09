// This file contains the Settings class.
// -----------------------------------------------------------------------------

/**
 * Settings in browser storage that determine the circumstances under which a
 * video should be hidden.
 */
class Settings {
    /**
     * Constructs a new Settings object and, for convenience, loads its state.
     */
    constructor() {
        this.state = DEFAULT_SETTINGS_STATE;
        this.load();
    }

    /**
     * Reports whether watched videos on the current page should be hidden,
     * taking into account the state of the universal Hide Videos toggle,
     * bookmarks, and channel filter.
     *
     * @returns {boolean} - True iff videos should be hidden.
     */
    hidden() {
        const channel = document.querySelector("#channel-container");
        if (channel && this.state["hide-channels-checkbox-state"] === false) {
            return false;
        }

        const page = Path.parse(window.location.toString());
        const bookmark = this.state["hide-videos-bookmarks"][page];
        const universal = this.state["hide-videos-checkbox-state"];
        return bookmark === undefined ? universal : bookmark;
    }

    /**
     * Returns the current view threshold.
     *
     * @returns {number} - Minimum watch progress of a viewed video inside the
     * inclusive range [1, 100].
     */
    threshold() {
        const enabled = this.state["view-threshold-checkbox-state"] === true;
        const percent = this.state["view-threshold-slider-value"];
        return enabled ? percent : 100;
    }

    /**
     * Loads the state from browser storage and then invokes the given callback
     * if one is provided.
     *
     * @param {*} continuation - Function to be called after the state is loaded.
     */
    load(continuation) {
        const callback = (values) => {
            Logger.debug("Settings.load(): loaded", values, ".");
            this.state = values;
            if (continuation !== undefined) {
                continuation();
            }
        }
        Storage.get(DEFAULT_SETTINGS_STATE, callback);
    }
}
