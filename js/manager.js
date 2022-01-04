// This script implements the Manager class.
// -----------------------------------------------------------------------------

// Manager manages a collection of Videos.
class Manager {
    // Constructs a new Manager object.
    constructor() {
        this.album = new Album();

        const subextractors = [
            extractGridVideos,
            extractHistoryVideos,
            extractHomeVideos,
            extractPlaylistVideos,
            extractRecommendedVideos,
            extractSearchVideos
        ]

        this.extractor = new Extractor();
        subextractors.forEach(subextractor => this.extractor.insert(subextractor));

        // Determines whether this Manager is ready to poll the DOM; this flag
        // is used to combine several Manager update requests that happen in
        // rapid temporal succession.
        this.ready = true;

        this.restore();
        this.listen();
    }

    // Restores the Manager state to reflect the stored "Hide Videos" and "View Threshold" values.
    restore() {
        const callback = (values) => {
            const page = Path.parse(window.location.toString());
            this.hide_videos_checkbox_state = values["hide-videos-checkbox-state"];
            this.hide_videos_bookmark_state = values["hide-videos-bookmarks"][page];
            this.hidden = this.hide_videos_bookmark_state !== undefined ? this.hide_videos_bookmark_state : this.hide_videos_checkbox_state;
            Logger.info(`Manager.restore(): setting hidden to ${this.hidden}.`);

            this.view_threshold_checkbox_state = values["view-threshold-checkbox-state"];
            this.view_threshold_slider_value = values["view-threshold-slider-value"];
            this.threshold = this.view_threshold_checkbox_state ? this.view_threshold_slider_value : 100;
            Logger.info(`Manager.restore(): setting threshold to ${this.threshold}.`);
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
            setTimeout(() => this.poll(), POLL_BATCH_TIME_MILLISECONDS);
        }
    }

    // Polls the DOM for new Videos and updates the Video collection if necessary.
    poll() {
        // Construct an Album from each of the viewed Videos in the DOM.
        const videos = this.extractor.extract(document, this);
        const album = new Album();
        videos.forEach(video => album.add(video));

        // Incorporate the new Album and refresh the visibilities of the Videos.
        this.album.merge(album);
        this.refresh();

        // Reset the batch MutationObserver flag.
        this.ready = true;
    }

    // -----------------------------------------------------------------------------

    // Refreshes the Album associated with this Manager.
    refresh() {
        Logger.info("Manager.refresh():", this.hidden ? "hiding" : "showing", "Videos.");
        this.album.refresh(this.hidden);
    }
}
