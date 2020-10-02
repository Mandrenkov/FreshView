// This script initializes the FreshView UI.
// -----------------------------------------------------------------------------

// Initializes the "Dark Mode" widget.
function initDarkModeWidget() {
    const checkbox = document.getElementById("dark-mode-checkbox");
    // Initializes the state of the "Dark Mode" widget.
    const setup = (values) => {
        checkbox.checked = values["dark-mode-checkbox-state"];
        render();
    }
    // Publishes the state of the "Dark Mode" widget.
    const publish = () => {
        Storage.set({"dark-mode-checkbox-state": checkbox.checked}, render);
    };
    // Renders the state of the "Dark Mode" widget.
    const render = () => {
        const theme = checkbox.checked ? "dark" : "light";
        document.documentElement.setAttribute('theme', theme);
    }
    // Initialize the state of the "Dark Mode" widget and attach an event listener for changes.
    Storage.get({"dark-mode-checkbox-state": Manager.DEFAULT_DARK_MODE_CHECKBOX_STATE}, setup);
    checkbox.addEventListener("change", publish);
}

// Initializes the "Hide Videos" widget.
function initHideVideosWidget() {
    const checkbox = document.getElementById("hide-videos-checkbox");
    // Initializes the state of the "Hide Videos" widget.
    const setup = (values) => {
        console.log("Setup checkbox state to", values);
        checkbox.checked = values["hide-videos-checkbox-state"];
    }
    // Publishes the state of the "Hide Videos" widget.
    const publish = () => {
        console.log("Published checkbox state to", checkbox.checked);
        Storage.set({"hide-videos-checkbox-state": checkbox.checked});
    }
    // Initialize the state of the "Hide Videos" widget and attach an event listener for changes.
    Storage.get({"hide-videos-checkbox-state": Manager.DEFAULT_HIDE_VIDEOS_CHECKBOX_STATE}, setup);
    checkbox.addEventListener("change", publish);
}

// Initializes the "View Threshold" widget.
function initViewThresholdWidget() {
    const checkbox = document.getElementById("view-threshold-checkbox");
    const slider = document.getElementById("view-threshold-slider");
    const percent = document.getElementById("view-threshold-percent");
    // Initializes the state of the "View Threshold" widget.
    const setup = (values) => {
        checkbox.checked = values["view-threshold-checkbox-state"];
        slider.value = values["view-threshold-slider-value"];
        render();
    }
    // Publishes the state of the "View Threshold" widget.
    const publish = () => {
        Storage.set({"view-threshold-checkbox-state": checkbox.checked,
                     "view-threshold-slider-value": slider.value}, render);
    }
    // Renders the state of the "View Threshold" widget.
    const render = () => {
        const track_width = slider.clientWidth;
        const thumb_width = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--thumb-size"));
        const distance = Math.ceil((1 - (slider.value - 1) / 99) * (track_width - thumb_width));
        document.documentElement.style.setProperty("--thumb-translation", `${distance}px`);
        slider.disabled = !checkbox.checked;
        percent.textContent = checkbox.checked ? slider.value + "%" : "100%";
    }
    // Initialize the state of the "View Threshold" widget and attach event listeners for changes.
    Storage.get({"view-threshold-checkbox-state": Manager.DEFAULT_VIEW_THRESHOLD_CHECKBOX_STATE,
                 "view-threshold-slider-value": Manager.DEFAULT_VIEW_THRESHOLD_SLIDER_VALUE}, setup);
    slider.addEventListener("input", publish);
    checkbox.addEventListener("change", publish);
}

// -----------------------------------------------------------------------------

// Propagates browser storage change events to their corresponding UI widgets.
function onStorageChangedListener(changes, _) {
    if ("hide-videos-checkbox-state" in changes) {
        const checkbox = document.getElementById("hide-videos-checkbox");
        checkbox.checked = changes["hide-videos-checkbox-state"].newValue;
        const event = new Event('change');
        checkbox.dispatchEvent(event);
    }
    if ("view-threshold-checkbox-state" in changes) {
        const checkbox = document.getElementById("view-threshold-checkbox");
        checkbox.checked = changes["view-threshold-checkbox-state"].newValue;
        const event = new Event('change');
        checkbox.dispatchEvent(event);
    }
    if ("view-threshold-slider-value" in changes) {
        const slider = document.getElementById("view-threshold-slider");
        slider.value = changes["view-threshold-slider-value"].newValue;
        const event = new Event('mouseup');
        slider.dispatchEvent(event);
    }
}

// -----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    // Initialize the "Dark Mode", "Hide Videos", and "View Threshold" widgets.
    initDarkModeWidget();
    initHideVideosWidget();
    initViewThresholdWidget();
    // Update these widgets when an external storage change event fires.
    chrome.storage.onChanged.addListener(onStorageChangedListener);
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
