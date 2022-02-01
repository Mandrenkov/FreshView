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

// Filters (Pages)
const HIDE_CHANNELS_CHECKBOX_STORAGE_KEY = "hide-channels-checkbox-state";
const HIDE_CHANNELS_CHECKBOX_DEFAULT_STATE = true;

const HIDE_HOME_CHECKBOX_STORAGE_KEY = "hide-home-checkbox-state"
const HIDE_HOME_CHECKBOX_DEFAULT_STATE = true;

const HIDE_EXPLORE_CHECKBOX_STORAGE_KEY = "hide-explore-checkbox-state"
const HIDE_EXPLORE_CHECKBOX_DEFAULT_STATE = true;

const HIDE_LIBRARY_CHECKBOX_STORAGE_KEY = "hide-library-checkbox-state"
const HIDE_LIBRARY_CHECKBOX_DEFAULT_STATE = true;

const HIDE_HISTORY_CHECKBOX_STORAGE_KEY = "hide-history-checkbox-state"
const HIDE_HISTORY_CHECKBOX_DEFAULT_STATE = false;

const HIDE_SUBSCRIPTIONS_CHECKBOX_STORAGE_KEY = "hide-subscriptions-checkbox-state"
const HIDE_SUBSCRIPTIONS_CHECKBOX_DEFAULT_STATE = true;


// View Threshold
const VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY = "view-threshold-checkbox-state";
const VIEW_THRESHOLD_CHECKBOX_DEFAULT_STATE = true;
const VIEW_THRESHOLD_SLIDER_STORAGE_KEY = "view-threshold-slider-value";
const VIEW_THRESHOLD_SLIDER_DEFAULT_STATE = 90;

// Hide Videos
const HIDE_VIDEOS_CHECKBOX_STORAGE_KEY = "hide-videos-checkbox-state";
const HIDE_VIDEOS_CHECKBOX_DEFAULT_STATE = false;
const HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY = "hide-videos-bookmarks";
const HIDE_VIDEOS_BOOKMARKS_DEFAULT_STATE = {};

// -----------------------------------------------------------------------------

// Number of milliseconds over which poll requests should be batched together
const BATCH_TIME_MILLISECONDS = 50;

// -----------------------------------------------------------------------------

// Message indicating a URL change.
const URL_CHANGE_MESSAGE = "url-change";
// Message requesting a page filter query.
const PAGE_FILTER_QUERY_MESSAGE = "page-filter-query";

// -----------------------------------------------------------------------------

// Default Settings state
const SETTINGS_DEFAULT_STATE = {
    // Filters (Types)
    [HIDE_RECOMMENDATIONS_CHECKBOX_STORAGE_KEY]: HIDE_RECOMMENDATIONS_CHECKBOX_DEFAULT_STATE,
    [HIDE_PLAYLISTS_CHECKBOX_STORAGE_KEY]: HIDE_PLAYLISTS_CHECKBOX_DEFAULT_STATE,
    [HIDE_SEARCHES_CHECKBOX_STORAGE_KEY]: HIDE_SEARCHES_CHECKBOX_DEFAULT_STATE,
    [HIDE_CHANNELS_CHECKBOX_STORAGE_KEY]: HIDE_CHANNELS_CHECKBOX_DEFAULT_STATE,

    // Filters (Pages)
    [HIDE_HOME_CHECKBOX_STORAGE_KEY]: HIDE_HOME_CHECKBOX_DEFAULT_STATE,
    [HIDE_EXPLORE_CHECKBOX_STORAGE_KEY]: HIDE_EXPLORE_CHECKBOX_DEFAULT_STATE,
    [HIDE_LIBRARY_CHECKBOX_STORAGE_KEY]: HIDE_LIBRARY_CHECKBOX_DEFAULT_STATE,
    [HIDE_HISTORY_CHECKBOX_STORAGE_KEY]: HIDE_HISTORY_CHECKBOX_DEFAULT_STATE,
    [HIDE_SUBSCRIPTIONS_CHECKBOX_STORAGE_KEY]: HIDE_SUBSCRIPTIONS_CHECKBOX_DEFAULT_STATE,

    // Hide Videos
    [HIDE_VIDEOS_CHECKBOX_STORAGE_KEY]: HIDE_VIDEOS_CHECKBOX_DEFAULT_STATE,
    [HIDE_VIDEOS_BOOKMARKS_STORAGE_KEY]: HIDE_VIDEOS_BOOKMARKS_DEFAULT_STATE,

    // View Threshold
    [VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY]: VIEW_THRESHOLD_CHECKBOX_DEFAULT_STATE,
    [VIEW_THRESHOLD_SLIDER_STORAGE_KEY]: VIEW_THRESHOLD_SLIDER_DEFAULT_STATE
};
