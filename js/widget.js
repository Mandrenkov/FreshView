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
     * @param {*} default_state - Default state of the widget (typically used
     *     when browser storage is missing an entry for the storage keys).
     */
    constructor(element_id, storage_keys, default_state) {
        this.element = document.getElementById(element_id);
        this.storage_keys = storage_keys;
        this.default_state = default_state;

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
     * @param {*} default_state - See Widget.constructor().
     */
    constructor(element_id, storage_key, default_state) {
        super(element_id, [storage_key], default_state);
        this.storage_key = storage_key;

        this.load();
        this.element.addEventListener("change", () => this.save());
    }

    /**
     * See Widget.load().
     */
    load() {
        const items = {[this.storage_key]: this.default_state};
        Storage.get(items, values => this.on_load(values));
    }

    /**
     * Called from Checkbox.load() to update the checkbox UI.
     *
     * @param {Object} values - Values from browser storage.
     */
    on_load(values) {
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
            "dark-mode-checkbox-state",
            DEFAULT_HIDE_VIDEOS_CHECKBOX_STATE
        );
    }

    /**
     * See Checkbox.on_load().
     */
    on_load(values) {
        super.on_load(values);
        const theme = this.element.checked ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
    }
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
            ["hide-videos-checkbox-state", "hide-videos-bookmarks"],
            DEFAULT_HIDE_VIDEOS_CHECKBOX_STATE
        );

        this.load();
        this.element.addEventListener("change", () => this.save());
    }

    /**
     * See Widget.load().
     */
    load() {
        const items = {
            "hide-videos-checkbox-state": DEFAULT_HIDE_VIDEOS_CHECKBOX_STATE,
            "hide-videos-bookmarks": DEFAULT_HIDE_VIDEOS_BOOKMARKS,
        };
        Storage.get(items, values => this.on_load(values));
    }

    /**
     * Called from HideVideosCheckbox.load() to update the Hide Videos checkbox UI.
     *
     * @param {Object} values - Values from browser storage.
     */
    on_load(values) {
        const bookmarks = values["hide-videos-bookmarks"];
        const universal = values["hide-videos-checkbox-state"];

        const callback = (page) => {
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
        const items = {"hide-videos-checkbox-state": this.element.checked};
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
            ["hide-videos-checkbox-state", "hide-videos-bookmarks"],
            DEFAULT_HIDE_VIDEOS_BOOKMARK_STATE
        );

        this.load();
        this.element.addEventListener("change", () => this.save());
    }

    /**
     * See Widget.load().
     */
    load() {
        const items = {"hide-videos-bookmarks": DEFAULT_HIDE_VIDEOS_BOOKMARKS};
        Storage.get(items, values => this.on_load(values));
    }

    /**
     * Called from Bookmark.load() to update the Bookmark checkbox UI.
     *
     * @param {Object} values - Values from browser storage.
     */
    on_load(values) {
        const bookmarks = values["hide-videos-bookmarks"];

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
            "hide-videos-checkbox-state": DEFAULT_HIDE_VIDEOS_CHECKBOX_STATE,
            "hide-videos-bookmarks": DEFAULT_HIDE_VIDEOS_BOOKMARKS,
        };
        Storage.get(items, values => this.on_save(values));
    }

    /**
     * Called from BookmarkCheckbox.save() to update browser storage.
     *
     * @param {Object} values - Values from browser storage.
     */
    on_save(values) {
        const bookmarks = values["hide-videos-bookmarks"];
        const universal = values["hide-videos-checkbox-state"];

        const callback = (page) => {
            if (this.element.checked) {
                bookmarks[page] = universal;
            } else {
                delete bookmarks[page];
            }

            Storage.set({"hide-videos-bookmarks": bookmarks});
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
            "view-threshold-checkbox-state",
            DEFAULT_VIEW_THRESHOLD_CHECKBOX_STATE,
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
            ["view-threshold-checkbox-state", "view-threshold-slider-value"],
            DEFAULT_VIEW_THRESHOLD_SLIDER_VALUE
        );

        this.load();
        this.element.addEventListener("input", () => this.save());
    }

    /**
     * See Widget.load().
     */
    load() {
        const items = {
            "view-threshold-checkbox-state": DEFAULT_VIEW_THRESHOLD_CHECKBOX_STATE,
            "view-threshold-slider-value": DEFAULT_VIEW_THRESHOLD_SLIDER_VALUE,
        };
        Storage.get(items, values => this.on_load(values));
    }

    /**
     * Called from ViewThresholdSlider.load() to update the View Threshold slider UI.
     *
     * @param {Object} values - Values from browser storage.
     */
    on_load(values) {
        this.element.value = values["view-threshold-slider-value"];

        const track_width = this.element.clientWidth;
        const thumb_width = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--thumb-size"));
        const distance = Math.ceil((1 - (this.element.value - 1) / 99) * (track_width - thumb_width));
        document.documentElement.style.setProperty("--thumb-translation", `${distance}px`);

        this.element.disabled = values["view-threshold-checkbox-state"] === false;
    }

    /**
     * See Widget.save().
     */
    save() {
        const items = {"view-threshold-slider-value": this.element.value};
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
            ["view-threshold-checkbox-state", "view-threshold-slider-value"],
            `${DEFAULT_VIEW_THRESHOLD_SLIDER_VALUE}%`
        );

        this.load();
    }

    /**
     * See Widget.load().
     */
    load() {
        const items = {
            "view-threshold-checkbox-state": DEFAULT_VIEW_THRESHOLD_CHECKBOX_STATE,
            "view-threshold-slider-value": DEFAULT_VIEW_THRESHOLD_SLIDER_VALUE,
        };
        Storage.get(items, values => this.on_load(values));
    }

    /**
     * Called from ViewThresholdLabel.load() to update the View Threshold slider UI.
     *
     * @param {Object} values - Values from browser storage.
     */
    on_load(values) {
        const enabled = values["view-threshold-checkbox-state"] === true;
        const percent = values["view-threshold-slider-value"];

        if (enabled) {
            this.element.textContent = `${percent}%`;
        } else {
            this.element.textContent = "100%";
        }
    }
}

// Filters
// -----------------------------------------------------------------------------

/**
 * Widget for checkboxs that hide videos on a specific YouTube page.
 */
class HidePageCheckbox extends Checkbox {
    /**
     * Constructs a new Hide Page checkbox by calling the Checkbox constructor.
     *
     * @param {string} element_id - See Checkbox.constructor().
     * @param {string} youtube_page - Path to the YouTube page associated with
     *      the checkbox.
     * @param {*} default_state - See Checkbox.constructor().
     */
    constructor(element_id, youtube_page, default_state) {
        super(element_id, ["hide-videos-bookmarks"], default_state);
        this.youtube_page = youtube_page;
    }

    /**
     * See Checkbox.load().
     */
    load() {
        const items = {"hide-videos-bookmarks": DEFAULT_HIDE_VIDEOS_BOOKMARKS};
        Storage.get(items, values => this.on_load(values));
    }

    /**
     * Called from HidePageCheckbox.load() to update the checkbox UI.
     *
     * @param {Object} values - Values from browser storage.
     */
    on_load(values) {
        const bookmarks = values["hide-videos-bookmarks"];
        if (bookmarks.hasOwnProperty(this.youtube_page)) {
            this.element.checked = bookmarks[this.youtube_page];
        } else {
            this.element.checked = this.default_state;
        }
    }

    /**
     * See Checkbox.save().
     */
    save() {
        const items = {"hide-videos-bookmarks": DEFAULT_HIDE_VIDEOS_BOOKMARKS};
        Storage.get(items, values => this.on_save(values));
    }

    /**
     * Called from HidePageCheckbox.save() to update browser storage.
     *
     * @param {Object} values - Values from browser storage.
     */
    on_save(values) {
        const bookmarks = values["hide-videos-bookmarks"];
        bookmarks[this.youtube_page] = this.element.checked;
        Storage.set({"hide-videos-bookmarks": bookmarks});
    }
}
