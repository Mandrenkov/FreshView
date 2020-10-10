// This script implements the Manager class.
// -----------------------------------------------------------------------------

// Manager manages a collection of Videos.
class Manager {
    // Constructs a new Manager object.
    constructor() {
        this.album = new Album();

        // Determines whether this Manager is ready to poll the DOM.
        this.ready = true;

        this.restore();
        this.listen();
    }

    // Restores the Manager state to reflect the stored "Hide Videos" and "View Threshold" values.
    restore() {
        const callback = (values) => {
            const url = new URL(window.location.toString());
            const page = url.pathname + url.search;
            this.hide_videos_checkbox_state = values["hide-videos-checkbox-state"];
            this.hide_videos_bookmark_state = values["hide-videos-bookmarks"][page];
            this.hidden = this.hide_videos_bookmark_state !== undefined ? this.hide_videos_bookmark_state : this.hide_videos_checkbox_state;
            Logger.info(`Manager.restore(): Setting hidden to "${this.hidden}".`);

            this.view_threshold_checkbox_state = values["view-threshold-checkbox-state"];
            this.view_threshold_slider_value = values["view-threshold-slider-value"];
            this.threshold = this.view_threshold_checkbox_state ? this.view_threshold_slider_value : 100;
            Logger.info(`Manager.restore(): Setting threshold to "${this.threshold}".`);
        }
        Storage.get({"hide-videos-checkbox-state": Manager.DEFAULT_HIDE_VIDEOS_CHECKBOX_STATE,
                     "hide-videos-bookmarks": Manager.DEFAULT_HIDE_VIDEOS_BOOKMARKS,
                     "view-threshold-checkbox-state": Manager.DEFAULT_VIEW_THRESHOLD_CHECKBOX_STATE,
                     "view-threshold-slider-value": Manager.DEFAULT_VIEW_THRESHOLD_SLIDER_VALUE}, callback);
    }

    // Attaches a MutationObserver which listens for DOM mutation events to this Manager.
    listen() {
        // Construct a MutationObserver with a callback that batches invocations to poll().
        const observer = new MutationObserver(() => this.request());

        // Attach the MutationObserver to all childList mutations in the DOM.
        const node = document.getRootNode();
        const conf = {childList: true, subtree: true};
        observer.observe(node, conf);
    }

    // -------------------------------------------------------------------------

    // Requests this Manager to poll the DOM.  Poll requests that are issued in
    // rapid succession are batched into a single poll request.
    request() {
        if (this.ready) {
            this.ready = false;
            setTimeout(() => this.poll(), Manager.BATCH_TIME);
        }
    }

    // Polls the DOM for new Videos and updates the Video collection if necessary.
    poll() {
        // Construct an Album from each of the viewed Videos in the DOM.
        const videos = this.fetchVideos();
        const album = new Album(videos);
        videos.forEach(video => album.add(video));

        // Incorporate the new Album and refresh the visibilities of the Videos.
        this.album.merge(album);
        this.refresh();

        // Reset the batch MutationObserver flag.
        this.ready = true;
    }

    // -------------------------------------------------------------------------

    // Fetches all the viewed Videos in the current DOM.
    fetchVideos() {
        const elements = [].concat(
            this.fetchSectionVideos(document),
            this.fetchGridVideos(document),
            this.fetchSearchVideos(document),
            this.fetchSecondaryVideos(document),
            this.fetchShelfVideos(document),
            this.fetchPlaylistVideos(document),
            this.fetchItemVideos(document)
        );

        // Construct a list of viewed Videos from the Video elements.
        const videos = elements.map(element => new Video(element, this));
        const viewed = videos.filter(video => video.getViewed());
        Logger.info("Manager.fetchVideos(): %d/%d Videos on the page were viewed.", viewed.length, videos.length);
        return viewed;
    }

    // Fetches all the section Videos in the given HTML element.
    fetchSectionVideos(element) {
        const elements = Array.from(element.querySelectorAll("ytd-item-section-renderer.style-scope.ytd-section-list-renderer"));
        return elements.filter(element => this.fetchGridVideos(element).length      == 1
                                       || this.fetchSearchVideos(element).length    == 1
                                       || this.fetchSecondaryVideos(element).length == 1
                                       || this.fetchShelfVideos(element).length     == 1
                                       || this.fetchPlaylistVideos(element).length  == 1
                                       || this.fetchItemVideos(element).length      == 1);
    }

    // Fetches all the grid Videos in the given HTML element.
    fetchGridVideos(element) {
        return Array.from(element.querySelectorAll(":scope ytd-grid-video-renderer.style-scope.yt-horizontal-list-renderer")).concat(
               Array.from(element.querySelectorAll(":scope ytd-grid-video-renderer.style-scope.ytd-grid-renderer")));
    }

    // Fetches all the search Videos in the given HTML element.
    fetchSearchVideos(element) {
        return Array.from(element.querySelectorAll(":scope ytd-video-renderer.style-scope.ytd-item-section-renderer")).concat(
               Array.from(element.querySelectorAll(":scope ytd-video-renderer.style-scope.ytd-vertical-list-renderer")));
    }

    // Fetches all the secondary Videos in the given HTML element.
    fetchSecondaryVideos(element) {
        return Array.from(element.querySelectorAll(":scope ytd-compact-video-renderer.style-scope.ytd-watch-next-secondary-results-renderer"));
    }

    // Fetches all the shelf Videos in the given HTML element.
    fetchShelfVideos(element) {
        return Array.from(element.querySelectorAll(":scope ytd-video-renderer.style-scope.ytd-expanded-shelf-contents-renderer"));
    }

    // Fetches all the playlist Videos in the given HTML element.
    fetchPlaylistVideos(element) {
        return Array.from(element.querySelectorAll(":scope ytd-playlist-video-renderer.style-scope.ytd-playlist-video-list-renderer")).concat(
               Array.from(element.querySelectorAll(":scope ytd-playlist-panel-video-renderer.style-scope.ytd-playlist-panel-renderer")));
    }

    // Fetches all the item Videos in the given HTML element.
    fetchItemVideos(element) {
        return Array.from(element.querySelectorAll(":scope ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer")).concat(
               Array.from(element.querySelectorAll(":scope ytd-rich-item-renderer.style-scope.ytd-rich-shelf-renderer")));
    }

    // -----------------------------------------------------------------------------

    // Refreshes the Album associated with this Manager.
    refresh() {
        Logger.info("Manager.refresh():", this.hidden ? "Hiding" : "Showing", "Videos.");
        this.album.refresh(!this.hidden);
    }
}

// -----------------------------------------------------------------------------

// Default "Hide Videos", "View Threshold", and "Dark Mode" state values.
Manager.DEFAULT_DARK_MODE_CHECKBOX_STATE = false;
Manager.DEFAULT_VIEW_THRESHOLD_CHECKBOX_STATE = true;
Manager.DEFAULT_VIEW_THRESHOLD_SLIDER_VALUE = 90;
Manager.DEFAULT_HIDE_VIDEOS_CHECKBOX_STATE = false;
Manager.DEFAULT_HIDE_VIDEO_BOOKMARKS = {"/feed/history": false};

// Default CSS transition duration.
Manager.DEFAULT_COLOUR_TRANSITION_DURATION = "0.2s";
Manager.DEFAULT_SLIDER_TRANSITION_DURATION = "0.4s";
Manager.DEFAULT_TOGGLE_TRANSITION_DURATION = "0.4s";

// Time interval to batch poll requests.
Manager.BATCH_TIME = 200;