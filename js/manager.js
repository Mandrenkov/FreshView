// This file contains the Manager class.
// -----------------------------------------------------------------------------

/**
 * Manages a collection of videos by applying settings and polling the DOM.
 */
class Manager {
    /**
     * Constructs a new Manager object.
     */
    constructor() {
        this.album = new Album();
        this.settings = new Settings();
        this.ready = true;

        // Call request() when the DOM is mutated.
        const observer = new MutationObserver(() => this.request());
        observer.observe(document.getRootNode(), {childList: true, subtree: true});
    }

    /**
     * Updates the visibility of the video collection based on Settings.hidden()
     * and Settings.ignored().
     */
    display() {
        const hidden = !this.settings.ignored() && this.settings.hidden();
        Logger.debug(`Manager.display(): ${hidden ? "hiding" : "showing"} videos.`);
        
        const videos = this.album.getVideos();
        videos.forEach(video => hidden ? video.hide() : video.show());
    }

    /**
     * Submits a request to poll the DOM. Poll requests that are issued in rapid
     * succession are batched together into a single poll request.
     */
    request() {
        const callback = () => {
            Logger.debug("Manager.request(): polling the DOM.");
            this.poll();
            this.ready = true;
        };

        if (this.ready) {
            this.ready = false;
            setTimeout(callback, BATCH_TIME_MILLISECONDS);
        }
    }

    /**
     * Updates the video collection by extracting videos from the DOM.
     *
     * Note: This function should not be called directly; use request() instead.
     */
    poll() {
        const album = this.extract();
        this.album.merge(album);
        this.display();
    }

    /**
     * Returns the videos on the current page which pass the enabled filters and
     * have a watch progress that matches or exceeds the view threshold.
     *
     * @returns {Album} - Collection of viewed videos.
     */
    extract() {
        const extractor = new Extractor();

        extractor.insert(extractExploreVideos);
        extractor.insert(extractGridVideos);
        extractor.insert(extractHistoryVideos);
        extractor.insert(extractHomeVideos);

        const filters = {
            [HIDE_PLAYLISTS_CHECKBOX_STORAGE_KEY]: extractPlaylistVideos,
            [HIDE_RECOMMENDATIONS_CHECKBOX_STORAGE_KEY]: extractRecommendedVideos,
            [HIDE_SEARCHES_CHECKBOX_STORAGE_KEY]: extractSearchVideos
        };

        for (const [key, subextractor] of Object.entries(filters)) {
            if (this.settings.state[key] !== false) {
                extractor.insert(subextractor);
            }
        }

        const threshold = this.settings.threshold();
        const videos = extractor.extract(document, threshold);
        return new Album(videos);
    }
}
