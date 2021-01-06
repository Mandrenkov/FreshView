// This script implements the logical states of the "Dark Mode", "Hide Videos",
// and "View Threshold" UI widgets.  Since all of these widgets are singeletons,
// their classes consist exclusively of static members.
// -----------------------------------------------------------------------------

class DarkModeWidget {
    // Initializes the "Dark Mode" widget.
    static init() {
        this.checkbox = document.getElementById("dark-mode-checkbox");
        this.checkbox.addEventListener("change", () => this.publish());
        this.restore();
    }

    // Restores the state of the "Dark Mode" widget to reflect the stored "Dark Mode" values.
    static restore() {
        Storage.get({"dark-mode-checkbox-state": Manager.DEFAULT_DARK_MODE_CHECKBOX_STATE}, (values) => this.update(values));
    }

    // Updates the state of the "Dark Mode" widget.
    static update(values) {
        this.checkbox.checked = values["dark-mode-checkbox-state"];
        this.render();
    }

    // Publishes the state of the "Dark Mode" widget.
    static publish() {
        Storage.set({"dark-mode-checkbox-state": this.checkbox.checked}, () => this.render());
    }

    // Renders the state of the "Dark Mode" widget.
    static render() {
        const theme = this.checkbox.checked ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
    }
}

// DOM element corresponding to the checkbox of the "Dark Mode" widget.
DarkModeWidget.checkbox = undefined;

// -----------------------------------------------------------------------------

class HideVideosWidget {
    // Initializes the "Hide Videos" widget.
    static init() {
        this.checkbox = document.getElementById("hide-videos-checkbox");
        this.bookmark = document.getElementById("hide-videos-bookmark");
        this.checkbox.addEventListener("change", () => this.publish_checkbox());
        this.bookmark.addEventListener("change", () => this.publish_bookmark());
        this.restore();
    }

    // Restores the state of the "Hide Videos" widget to reflect the stored "Hide Videos" values.
    static restore() {
        const callback = (tabs) => {
            this.page = Path.parseURL(tabs[0].url)
            Storage.get({"hide-videos-checkbox-state": Manager.DEFAULT_HIDE_VIDEOS_CHECKBOX_STATE,
                         "hide-videos-bookmarks": Manager.DEFAULT_HIDE_VIDEOS_BOOKMARKS}, (values) => this.update(values));
        }
        chrome.tabs.query({active: true, lastFocusedWindow: true}, callback);
    }

    // Updates the state of the "Hide Videos" widget.
    static update(values) {
        const bookmarks = values["hide-videos-bookmarks"];
        this.bookmark.checked = bookmarks[this.page] !== undefined;
        this.checkbox.checked = this.bookmark.checked ? bookmarks[this.page] : values["hide-videos-checkbox-state"];
        this.checkbox.disabled = this.bookmark.checked;
    }

    // Publishes the state of the "Hide Videos" widget on a "Hide Videos" checkbox change.
    static publish_checkbox() {
        if (!this.bookmark.checked) {
            Storage.set({"hide-videos-checkbox-state": this.checkbox.checked});
        }
    }

    // Publishes the state of the "Hide Videos" widget on a "Hide Videos" bookmark change.
    static publish_bookmark() {
        if (this.bookmark.checked) {
            // Create a new entry in the bookmark object for the current URL.
            const callback = (values) => {
                const bookmarks = values["hide-videos-bookmarks"];
                bookmarks[this.page] = this.checkbox.checked;
                Storage.set({"hide-videos-bookmarks": bookmarks});
            };
            Storage.get({"hide-videos-bookmarks": Manager.DEFAULT_HIDE_VIDEOS_BOOKMARKS}, callback);
        } else {
            // Delete the entry in the bookmark object for the current URL.
            const callback = (values) => {
                this.checkbox.checked = values["hide-videos-checkbox-state"];
                const bookmarks = values["hide-videos-bookmarks"];
                delete bookmarks[this.page];
                Storage.set({"hide-videos-bookmarks": bookmarks});
            };
            Storage.get({"hide-videos-checkbox-state": Manager.DEFAULT_HIDE_VIDEOS_CHECKBOX_STATE,
                          "hide-videos-bookmarks": Manager.DEFAULT_HIDE_VIDEOS_BOOKMARKS}, callback);
        }
        this.checkbox.disabled = this.bookmark.checked;
    }
}

// DOM elements corresponding to the checkbox and bookmark of the "Hide Videos" widget.
HideVideosWidget.checkbox = undefined;
HideVideosWidget.bookmark = undefined;
// URL of the active tab.
HideVideosWidget.page = undefined;

// -----------------------------------------------------------------------------

class ViewThresholdWidget {
    // Initializes the "View Threshold" widget.
    static init() {
        this.checkbox = document.getElementById("view-threshold-checkbox");
        this.slider = document.getElementById("view-threshold-slider");
        this.percent = document.getElementById("view-threshold-percent");
        this.slider.addEventListener("input", () => this.publish());
        this.checkbox.addEventListener("change", () => this.publish());
        this.restore();
    }

    // Restores the state of the "View Threshold" widget to reflect the stored "View Threshold" values.
    static restore() {
        Storage.get({"view-threshold-checkbox-state": Manager.DEFAULT_VIEW_THRESHOLD_CHECKBOX_STATE,
                     "view-threshold-slider-value": Manager.DEFAULT_VIEW_THRESHOLD_SLIDER_VALUE}, (values) => this.update(values));
    }

    // Updates the state of the "View Threshold" widget.
    static update(values) {
        this.checkbox.checked = values["view-threshold-checkbox-state"];
        this.slider.value = values["view-threshold-slider-value"];
        this.render();
    }

    // Publishes the state of the "View Threshold" widget.
    static publish() {
        Storage.set({"view-threshold-checkbox-state": this.checkbox.checked,
                     "view-threshold-slider-value": this.slider.value}, () => this.render());
    }

    // Renders the state of the "View Threshold" widget.
    static render() {
        const track_width = this.slider.clientWidth;
        const thumb_width = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--thumb-size"));
        const distance = Math.ceil((1 - (this.slider.value - 1) / 99) * (track_width - thumb_width));
        document.documentElement.style.setProperty("--thumb-translation", `${distance}px`);
        this.slider.disabled = !this.checkbox.checked;
        this.percent.textContent = this.checkbox.checked ? this.slider.value + "%" : "100%";
    }
}

// DOM elements corresponding to the checkbox, slider, and percent label of the "View Threshold" widget.
ViewThresholdWidget.checkbox = undefined;
ViewThresholdWidget.slider = undefined;
ViewThresholdWidget.percent = undefined;