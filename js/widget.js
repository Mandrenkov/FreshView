// This file contains the control logic for stateful UI widgets.
// -----------------------------------------------------------------------------

/**
 * A generic, stateful UI widget.
 *
 * Note: This class is not meant to be instantiated directly; subclasses must
 *       override the load() and save() functions.
 */
class Widget {
    /**
     * Constructs a new widget by obtaining a reference to an HTML element and
     * registering an event listener that calls Widget.load() whenever a change
     * to one or more keys is made in browser storage.
     *
     * @param {string} element_id - ID of the HTML element associated with the
     *     widget.
     * @param {string[]} storage_keys - Keys in browser storage associated with
     *     the state of the widget.
     * @param {*} fallback - Default state of the widget (typically used when
     *     browser storage is missing an entry for the storage keys).
     */
    constructor(element_id, storage_keys, fallback) {
        this.element = document.getElementById(element_id);
        this.storage_keys = storage_keys;
        this.fallback = fallback;

        const listener = (changes, _) => {
            if (this.storage_keys.some(key => changes.hasOwnProperty(key))) {
                this.load();
            }
        }
        chrome.storage.onChanged.addListener(listener);
    }

    /**
     * Loads the state of a widget from browser storage.
     */
    load() {
        throw new Error("Method Widget.load() must be overridden.");
    }

    /**
     * Saves the state of a widget to browser storage.
     */
    save() {
        throw new Error("Method Widget.save() must be overridden.");
    }
}

/**
 * Widget based on an HTML checkbox.
 */
class Checkbox extends Widget {
    /**
     * Constructs a new checkbox widget by calling the Widget constructor and
     * registering an event listener that calls Checkbox.save() on the "change"
     * event.
     *
     * @param {string} element_id - See Widget.constructor().
     * @param {string} storage_key - See Widget.constructor().
     * @param {*} fallback - See Widget.constructor().
     */
    constructor(element_id, storage_key, fallback) {
        super(element_id, [storage_key], fallback);
        this.storage_key = storage_key;

        this.load();
        this.element.addEventListener("change", () => this.save());
    }

    /**
     * See Widget.load().
     */
    load() {
        const items = {[this.storage_key]: this.fallback};
        Storage.get(items, values => this.onLoad(values));
    }

    /**
     * Called from Checkbox.load() to update the checkbox UI.
     *
     * @param {Object} values - Values from browser storage.
     */
    onLoad(values) {
        this.element.checked = values[this.storage_key];
    }

    /**
     * See Widget.save().
     */
    save() {
        const items = {[this.storage_key]: this.element.checked};
        Storage.set(items);
    }
}

// Dark Mode Theme
// -----------------------------------------------------------------------------

/**
 * Widget for the Dark Mode checkbox.
 */
class DarkModeCheckbox extends Checkbox {
    /**
     * Constructs a new Dark Mode checkbox by calling the Checkbox constructor.
     */
    constructor() {
        super(
            "dark-mode-checkbox",
            DARK_MODE_CHECKBOX_STORAGE_KEY,
            DARK_MODE_CHECKBOX_DEFAULT_STATE
        );
    }

    /**
     * See Checkbox.onLoad().
     */
    onLoad(values) {
        super.onLoad(values);
        setCSSTheme(values[DARK_MODE_CHECKBOX_STORAGE_KEY]);
    }
}

/**
 * Sets the CSS theme attribute to the desired theme.
 *
 * @param {boolean} dark - Whether to set the theme to "dark".
 */
function setCSSTheme(dark) {
    const theme = dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
}

// Hide Videos
// -----------------------------------------------------------------------------

/**
 * Widget for the Hide Videos checkbox.
 */
class HideVideosCheckbox extends Widget {
    /**
     * Constructs a new Hide Videos checkbox by calling the Widget constructor
     * and registering an event listener that calls HideVideosCheckbox.save() on
     * the "change" event.
     */
    constructor() {
        super(
            "hide-videos-checkbox",
            [
                HIDE_VIDEOS_CHECKBOX_STORAGE_KEY,
                HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY,
                HIDE_CHANNELS_CHECKBOX_STORAGE_KEY,
                HIDE_HOME_CHECKBOX_STORAGE_KEY,
                HIDE_EXPLORE_CHECKBOX_STORAGE_KEY,
                HIDE_LIBRARY_CHECKBOX_STORAGE_KEY,
                HIDE_HISTORY_CHECKBOX_STORAGE_KEY,
                HIDE_SUBSCRIPTIONS_CHECKBOX_STORAGE_KEY
            ],
            HIDE_VIDEOS_CHECKBOX_DEFAULT_STATE
        );

        this.load();
        this.element.addEventListener("change", () => this.save());
    }

    /**
     * See Widget.load().
     */
    load() {
        const items = {
            // Hide Videos
            [HIDE_VIDEOS_CHECKBOX_STORAGE_KEY]: HIDE_VIDEOS_CHECKBOX_DEFAULT_STATE,
            [HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY]: HIDE_VIDEOS_BOOKMARKS_DEFAULT_STATE,

            // Filters (Pages)
            [HIDE_CHANNELS_CHECKBOX_STORAGE_KEY]: HIDE_CHANNELS_CHECKBOX_DEFAULT_STATE,
            [HIDE_HOME_CHECKBOX_STORAGE_KEY]: HIDE_HOME_CHECKBOX_DEFAULT_STATE,
            [HIDE_EXPLORE_CHECKBOX_STORAGE_KEY]: HIDE_EXPLORE_CHECKBOX_DEFAULT_STATE,
            [HIDE_LIBRARY_CHECKBOX_STORAGE_KEY]: HIDE_LIBRARY_CHECKBOX_DEFAULT_STATE,
            [HIDE_HISTORY_CHECKBOX_STORAGE_KEY]: HIDE_HISTORY_CHECKBOX_DEFAULT_STATE,
            [HIDE_SUBSCRIPTIONS_CHECKBOX_STORAGE_KEY]: HIDE_SUBSCRIPTIONS_CHECKBOX_DEFAULT_STATE,
        };
        Storage.get(items, values => this.onLoad(values));
    }

    /**
     * Called from HideVideosCheckbox.load() to update the Hide Videos checkbox UI.
     *
     * @param {Object} values - Values from browser storage.
     */
    onLoad(values) {
        const bookmarks = values[HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY];
        const universal = values[HIDE_VIDEOS_CHECKBOX_STORAGE_KEY];

        const callback = (page) => {
            const filters = {
                [HIDE_CHANNELS_CHECKBOX_STORAGE_KEY]: HIDE_CHANNELS_CHECKBOX_REGEX,
                [HIDE_HOME_CHECKBOX_STORAGE_KEY]: HIDE_HOME_CHECKBOX_REGEX,
                [HIDE_EXPLORE_CHECKBOX_STORAGE_KEY]: HIDE_EXPLORE_CHECKBOX_REGEX,
                [HIDE_LIBRARY_CHECKBOX_STORAGE_KEY]: HIDE_LIBRARY_CHECKBOX_REGEX,
                [HIDE_HISTORY_CHECKBOX_STORAGE_KEY]: HIDE_HISTORY_CHECKBOX_REGEX,
                [HIDE_SUBSCRIPTIONS_CHECKBOX_STORAGE_KEY]: HIDE_SUBSCRIPTIONS_CHECKBOX_REGEX
            };

            for (const [key, regex] of Object.entries(filters)) {
                if (values[key] === false && regex.test(page)) {
                    this.element.checked = false;
                    this.element.disabled = true;
                    return;
                }
            }

            if (bookmarks.hasOwnProperty(page)) {
                this.element.checked = bookmarks[page];
                this.element.disabled = true;
            } else {
                this.element.checked = universal;
                this.element.disabled = false;
            }
        }

        Path.get(callback);
    }

    /**
     * See Widget.save().
     */
    save() {
        const items = {[HIDE_VIDEOS_CHECKBOX_STORAGE_KEY]: this.element.checked};
        Storage.set(items);
    }
}

/**
 * Widget for the Bookmark checkbox.
 */
class HideVideosBookmark extends Widget {
    /**
     * Constructs a new Hide Videos bookmark widget by calling the Widget
     * constructor and registering an event listener that calls
     * HideVideosBookmark.save() on the "change" event.
     */
    constructor() {
        super(
            "hide-videos-bookmark",
            [HIDE_VIDEOS_CHECKBOX_STORAGE_KEY, HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY],
            HIDE_VIDEOS_BOOKMARKS_DEFAULT_STATE
        );

        this.load();
        this.element.addEventListener("change", () => this.save());
    }

    /**
     * See Widget.load().
     */
    load() {
        const items = {[HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY]: HIDE_VIDEOS_BOOKMARKS_DEFAULT_STATE};
        Storage.get(items, values => this.onLoad(values));
    }

    /**
     * Called from Bookmark.load() to update the Bookmark checkbox UI.
     *
     * @param {Object} values - Values from browser storage.
     */
    onLoad(values) {
        const bookmarks = values[HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY];

        const callback = (page) => {
            this.element.checked = bookmarks.hasOwnProperty(page);
        }

        Path.get(callback);
    }

    /**
     * See Widget.save().
     */
    save() {
        const items = {
            [HIDE_VIDEOS_CHECKBOX_STORAGE_KEY]: HIDE_VIDEOS_CHECKBOX_DEFAULT_STATE,
            [HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY]: HIDE_VIDEOS_BOOKMARKS_DEFAULT_STATE,
        };
        Storage.get(items, values => this.onSave(values));
    }

    /**
     * Called from BookmarkCheckbox.save() to update browser storage.
     *
     * @param {Object} values - Values from browser storage.
     */
    onSave(values) {
        const bookmarks = values[HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY];
        const universal = values[HIDE_VIDEOS_CHECKBOX_STORAGE_KEY];

        const callback = (page) => {
            if (this.element.checked) {
                bookmarks[page] = universal;
            } else {
                delete bookmarks[page];
            }

            Storage.set({[HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY]: bookmarks});
        }

        Path.get(callback);
    }
}

// View Threshold
// -----------------------------------------------------------------------------

/**
 * Widget for the View Threshold checkbox.
 */
 class ViewThresholdCheckbox extends Checkbox {
    /**
     * Constructs a new View Threshold checkbox by calling the Checkbox constructor.
     */
    constructor() {
        super(
            "view-threshold-checkbox",
            VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY,
            VIEW_THRESHOLD_CHECKBOX_DEFAULT_STATE,
        );
    }
}

/**
 * Widget for the View Threshold slider.
 */
class ViewThresholdSlider extends Widget {
    /**
     * Constructs a new View Threshold slider by calling the Widget constructor
     * and registering an event listener that calls ViewThresholdSlider.save()
     * on the "input" event.
     */
    constructor() {
        super(
            "view-threshold-slider",
            [VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY, VIEW_THRESHOLD_SLIDER_STORAGE_KEY],
            VIEW_THRESHOLD_SLIDER_DEFAULT_STATE
        );

        this.load();
        this.element.addEventListener("input", () => this.save());
    }

    /**
     * See Widget.load().
     */
    load() {
        const items = {
            [VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY]: VIEW_THRESHOLD_CHECKBOX_DEFAULT_STATE,
            [VIEW_THRESHOLD_SLIDER_STORAGE_KEY]: VIEW_THRESHOLD_SLIDER_DEFAULT_STATE,
        };
        Storage.get(items, values => this.onLoad(values));
    }

    /**
     * Called from ViewThresholdSlider.load() to update the View Threshold slider UI.
     *
     * @param {Object} values - Values from browser storage.
     */
    onLoad(values) {
        this.element.value = values[VIEW_THRESHOLD_SLIDER_STORAGE_KEY];

        const track_width = this.element.clientWidth;
        const thumb_width = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--thumb-size"));
        const distance = Math.ceil((1 - (this.element.value - 1) / 99) * (track_width - thumb_width));
        document.documentElement.style.setProperty("--thumb-translation", `${distance}px`);

        this.element.disabled = values[VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY] === false;
    }

    /**
     * See Widget.save().
     */
    save() {
        const items = {VIEW_THRESHOLD_SLIDER_STORAGE_KEY: this.element.value};
        Storage.set(items);
    }
}

/**
 * Widget for the View Threshold label.
 */
 class ViewThresholdLabel extends Widget {
    /**
     * Constructs a new View Threshold label by calling the Widget constructor.
     */
    constructor() {
        super(
            "view-threshold-percent",
            [VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY, VIEW_THRESHOLD_SLIDER_STORAGE_KEY],
            `${VIEW_THRESHOLD_SLIDER_DEFAULT_STATE}%`
        );
        this.load();
    }

    /**
     * See Widget.load().
     */
    load() {
        const items = {
            [VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY]: VIEW_THRESHOLD_CHECKBOX_DEFAULT_STATE,
            [VIEW_THRESHOLD_SLIDER_STORAGE_KEY]: VIEW_THRESHOLD_SLIDER_DEFAULT_STATE,
        };
        Storage.get(items, values => this.onLoad(values));
    }

    /**
     * Called from ViewThresholdLabel.load() to update the View Threshold slider UI.
     *
     * @param {Object} values - Values from browser storage.
     */
    onLoad(values) {
        const enabled = values[VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY] === true;
        const percent = values[VIEW_THRESHOLD_SLIDER_STORAGE_KEY];

        if (enabled) {
            this.element.textContent = `${percent}%`;
        } else {
            this.element.textContent = "100%";
        }
    }
}
