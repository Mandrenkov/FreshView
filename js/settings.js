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
        this.state = SETTINGS_DEFAULT_STATE;
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
        const page = Path.parse(window.location.toString());

        const filters = {
            [HIDE_HOME_CHECKBOX_STORAGE_KEY]: new RegExp("/"),
            [HIDE_CHANNELS_CHECKBOX_STORAGE_KEY]: new RegExp("/(c|channel)/.*"),
            [HIDE_EXPLORE_CHECKBOX_STORAGE_KEY]: new RegExp("/feed/explore"),
            [HIDE_LIBRARY_CHECKBOX_STORAGE_KEY]: new RegExp("/feed/library"),
            [HIDE_HISTORY_CHECKBOX_STORAGE_KEY]: new RegExp("/feed/history"),
            [HIDE_SUBSCRIPTIONS_CHECKBOX_STORAGE_KEY]: new RegExp("/feed/subscriptions")
        };

        for (const [key, regex] of Object.entries(filters)) {
            if (this.state[key] === false && regex.test(page)) {
                return false;
            }
        }

        const bookmark = this.state[HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY][page];
        const universal = this.state[HIDE_VIDEOS_CHECKBOX_STORAGE_KEY];
        return bookmark === undefined ? universal : bookmark;
    }

    /**
     * Returns the current view threshold.
     *
     * @returns {number} - Minimum watch progress of a viewed video inside the
     * inclusive range [1, 100].
     */
    threshold() {
        const enabled = this.state[VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY] === true;
        const percent = this.state[VIEW_THRESHOLD_SLIDER_STORAGE_KEY];
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
        Storage.get(SETTINGS_DEFAULT_STATE, callback);
    }
}
