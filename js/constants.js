// This file contains constants that may be shared across different scripts.
// -----------------------------------------------------------------------------

// Dark Mode
const DARK_MODE_CHECKBOX_STORAGE_KEY = "dark-mode-checkbox-state";
const DARK_MODE_CHECKBOX_DEFAULT_STATE = false;

// Filters (Types)
const HIDE_RECOMMENDATIONS_CHECKBOX_STORAGE_KEY = "hide-recommendations-checkbox-state";
const HIDE_RECOMMENDATIONS_CHECKBOX_DEFAULT_STATE = true;
const HIDE_PLAYLISTS_CHECKBOX_STORAGE_KEY = "hide-playlists-checkbox-state";
const HIDE_PLAYLISTS_CHECKBOX_DEFAULT_STATE = true;
const HIDE_SEARCHES_CHECKBOX_STORAGE_KEY = "hide-searches-checkbox-state";
const HIDE_SEARCHES_CHECKBOX_DEFAULT_STATE = true;
const HIDE_CHANNELS_CHECKBOX_STORAGE_KEY = "hide-channels-checkbox-state";
const HIDE_CHANNELS_CHECKBOX_DEFAULT_STATE = true;

// Filters (Pages)
const DEFAULT_HIDE_HOME_CHECKBOX_STATE = true;
const DEFAULT_HIDE_EXPLORE_CHECKBOX_STATE = true;
const DEFAULT_HIDE_SUBSCRIPTIONS_CHECKBOX_STATE = true;
const DEFAULT_HIDE_LIBRARY_CHECKBOX_STATE = true;
const DEFAULT_HIDE_HISTORY_CHECKBOX_STATE = false;

// View Threshold
const VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY = "view-threshold-checkbox-state";
const VIEW_THRESHOLD_CHECKBOX_DEFAULT_STATE = true;
const VIEW_THRESHOLD_SLIDER_STORAGE_KEY = "view-threshold-slider-value";
const VIEW_THRESHOLD_SLIDER_DEFAULT_STATE = 90;

// Hide Videos
const HIDE_VIDEOS_CHECKBOX_STORAGE_KEY = "hide-videos-checkbox-state";
const HIDE_VIDEOS_CHECKBOX_DEFAULT_STATE = false;
const HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY = "hide-videos-bookmarks";
const HIDE_VIDEOS_BOOKMARKS_DEFAULT_STATE = {
    "/": DEFAULT_HIDE_HOME_CHECKBOX_STATE,
    "/feed/explore": DEFAULT_HIDE_EXPLORE_CHECKBOX_STATE,
    "/feed/subscriptions": DEFAULT_HIDE_SUBSCRIPTIONS_CHECKBOX_STATE,
    "/feed/library": DEFAULT_HIDE_LIBRARY_CHECKBOX_STATE,
    "/feed/history": DEFAULT_HIDE_HISTORY_CHECKBOX_STATE,
};

// -----------------------------------------------------------------------------

// Number of milliseconds over which poll requests should be batched together
const BATCH_TIME_MILLISECONDS = 50;

// -----------------------------------------------------------------------------

// Default Settings state
const SETTINGS_DEFAULT_STATE = {
    [HIDE_VIDEOS_CHECKBOX_STORAGE_KEY]: HIDE_VIDEOS_CHECKBOX_DEFAULT_STATE,
    [HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY]: HIDE_VIDEOS_BOOKMARKS_DEFAULT_STATE,
    [VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY]: VIEW_THRESHOLD_CHECKBOX_DEFAULT_STATE,
    [VIEW_THRESHOLD_SLIDER_STORAGE_KEY]: VIEW_THRESHOLD_SLIDER_DEFAULT_STATE,
    [HIDE_RECOMMENDATIONS_CHECKBOX_STORAGE_KEY]: HIDE_RECOMMENDATIONS_CHECKBOX_DEFAULT_STATE,
    [HIDE_PLAYLISTS_CHECKBOX_STORAGE_KEY]: HIDE_PLAYLISTS_CHECKBOX_DEFAULT_STATE,
    [HIDE_SEARCHES_CHECKBOX_STORAGE_KEY]: HIDE_SEARCHES_CHECKBOX_DEFAULT_STATE,
    [HIDE_CHANNELS_CHECKBOX_STORAGE_KEY]: HIDE_CHANNELS_CHECKBOX_DEFAULT_STATE
}
