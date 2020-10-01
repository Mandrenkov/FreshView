// This script initializes the FreshView UI.
// -----------------------------------------------------------------------------

// Returns the value of the specified key from the provided storage dictionary.
// If something goes wrong, the given default value is returned.
function extractStorageItem(items, key, value) {
    const valid = !chrome.runtime.lastError && items.hasOwnProperty(key);
    return valid ? items[key] : value;
}

// -----------------------------------------------------------------------------

// Initializes the "Dark Mode" checkbox.
function initDarkModeCheckbox() {
    const checkbox = document.getElementById("dark-mode-checkbox");
    // Initializes the state of the "Dark Mode" checkbox.
    function setup(items) {
        checkbox.checked = extractStorageItem(items, "dark-mode-checkbox-state", Manager.DEFAULT_DARK_MODE_CHECKBOX_STATE);
        render();
    }
    // Publishes the state of the "Dark Mode" checkbox.
    function publish(storage) {
        storage.set({"dark-mode-checkbox-state": checkbox.checked});
        render();
    }
    // Renders the state of the "Dark Mode" checkbox.
    function render() {
        const theme = checkbox.checked ? "dark" : "light";
        document.documentElement.setAttribute('theme', theme);
    }
    chrome.storage.sync.get("dark-mode-checkbox-state", setup);
    checkbox.addEventListener("change", () => publish(chrome.storage.sync));
}

// Initializes the "Hide Videos" checkbox.
function initHideVideosCheckbox() {
    const checkbox = document.getElementById("hide-videos-checkbox");
    // Initializes the state of the "Hide Videos" checkbox.
    function setup(items) {
        checkbox.checked = extractStorageItem(items, "hide-videos-checkbox-state", Manager.DEFAULT_HIDE_VIDEOS_CHECKBOX_STATE);
    }
    // Publishes the state of the "Hide Videos" checkbox.
    function publish(storage) {
        storage.set({"hide-videos-checkbox-state": checkbox.checked, "effective-hide-videos": checkbox.checked});
    }
    chrome.storage.sync.get("hide-videos-checkbox-state", setup);
    checkbox.addEventListener("change", () => publish(chrome.storage.sync));
}

// Initializes the "View Threshold" slider.
function initViewThresholdSlider() {
    const checkbox = document.getElementById("view-threshold-checkbox");
    const slider = document.getElementById("view-threshold-slider");
    const percent = document.getElementById("view-threshold-percent");
    // Initializes the state of the "View Threshold" slider.
    function setup(items) {
        checkbox.checked = extractStorageItem(items, "view-threshold-checkbox-state", Manager.DEFAULT_VIEW_THRESHOLD_CHECKBOX_STATE);
        slider.value = extractStorageItem(items, "view-threshold-slider-value", Manager.DEFAULT_VIEW_THRESHOLD_SLIDER_VALUE);
        render();
    }
    // Publishes the state of the "View Threshold" slider.
    function publish(storage) {
        if (!checkbox.checked) {
            // The "View Threshold" slider was just disabled.
            storage.set({"view-threshold-checkbox-state": false, "view-threshold-slider-value": slider.value, "effective-view-threshold": 100}, render);
        } else if (slider.disabled) {
            // The "View Threshold" slider was just enabled.
            storage.get("view-threshold-slider-value", items => {
                const valid = !chrome.runtime.lastError && items.hasOwnProperty("view-threshold-slider-value");
                slider.value = valid ? items["view-threshold-slider-value"] : Manager.DEFAULT_VIEW_THRESHOLD_SLIDER_VALUE;
                storage.set({"view-threshold-checkbox-state": true, "view-threshold-slider-value": slider.value, "effective-view-threshold": slider.value}, render);
            });
        } else {
            // The "View Threshold" slider was moved.
            storage.set({"view-threshold-slider-value": slider.value, "effective-view-threshold": slider.value}, render);
        }
    }
    // Renders the state of the "View Threshold" slider.
    function render() {
        const track_width = slider.clientWidth;
        const thumb_width = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--thumb-size"));
        const distance = Math.ceil((1 - (slider.value - 1) / 99) * (track_width - thumb_width));
        document.documentElement.style.setProperty("--thumb-translation", `${distance}px`);
        slider.disabled = !checkbox.checked;
        percent.textContent = checkbox.checked ? slider.value + "%" : "100%";
    }
    chrome.storage.sync.get(["view-threshold-checkbox-state", "view-threshold-slider-value"], setup);
    // Limit the number of updates to the synced slider state to avoid exhausting the storage API quota.
    slider.addEventListener("input", () => publish(chrome.storage.local));
    slider.addEventListener("mouseup", () => publish(chrome.storage.sync));
    checkbox.addEventListener("change", () => publish(chrome.storage.sync));
}

// -----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    // Initialize the "Dark Mode", "Hide Videos", and "View Threshold" elements.
    initDarkModeCheckbox();
    initHideVideosCheckbox();
    initViewThresholdSlider();
});

// Keep the CSS transitions instantaneous for the first animation frame to give
// the browser a chance to instantly load the correct state.  Afterwards, apply
// the intended CSS transition durations.
window.requestAnimationFrame(_ => window.requestAnimationFrame(_ => {
    const root = document.documentElement.style;
    root.setProperty("--transition-duration-colour", Manager.DEFAULT_COLOUR_TRANSITION_DURATION);
    root.setProperty("--transition-duration-slider", Manager.DEFAULT_SLIDER_TRANSITION_DURATION);
    root.setProperty("--transition-duration-toggle", Manager.DEFAULT_TOGGLE_TRANSITION_DURATION);
}));
