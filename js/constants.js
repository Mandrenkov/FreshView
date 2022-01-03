// Default Dark Mode checkbox state.
const DEFAULT_DARK_MODE_CHECKBOX_STATE = false;

// Default Filters (Types) checkbox states.
const DEFAULT_HIDE_RECOMMENDATIONS_CHECKBOX_STATE = true;
const DEFAULT_HIDE_PLAYLISTS_CHECKBOX_STATE = true;
const DEFAULT_HIDE_SEARCHES_CHECKBOX_STATE = true;
const DEFAULT_HIDE_CHANNELS_CHECKBOX_STATE = true;

// Default Filters (Pages) checkbox states.
const DEFAULT_HIDE_HOME_CHECKBOX_STATE = true;
const DEFAULT_HIDE_EXPLORE_CHECKBOX_STATE = true;
const DEFAULT_HIDE_SUBSCRIPTIONS_CHECKBOX_STATE = true;
const DEFAULT_HIDE_LIBRARY_CHECKBOX_STATE = true;
const DEFAULT_HIDE_HISTORY_CHECKBOX_STATE = false;

// Default View Threshold checkbox state and slider value.
const DEFAULT_VIEW_THRESHOLD_CHECKBOX_STATE = true;
const DEFAULT_VIEW_THRESHOLD_SLIDER_VALUE = 90;

// Default Hide Videos checkbox state and bookmarks.
const DEFAULT_HIDE_VIDEOS_CHECKBOX_STATE = false;
const DEFAULT_HIDE_VIDEOS_BOOKMARK_STATE = false;
const DEFAULT_HIDE_VIDEOS_BOOKMARKS = {
    "/": DEFAULT_HIDE_HOME_CHECKBOX_STATE,
    "/feed/explore": DEFAULT_HIDE_EXPLORE_CHECKBOX_STATE,
    "/feed/subscriptions": DEFAULT_HIDE_SUBSCRIPTIONS_CHECKBOX_STATE,
    "/feed/library": DEFAULT_HIDE_LIBRARY_CHECKBOX_STATE,
    "/feed/history": DEFAULT_HIDE_HISTORY_CHECKBOX_STATE,
};

// Number of milliseconds over which poll requests should be batched together.
const POLL_BATCH_TIME_MILLISECONDS = 200;