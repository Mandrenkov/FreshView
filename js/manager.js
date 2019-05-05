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

    // Restores the Manager state using the synchronized Chrome storage API.
    restore() {
        // Retrieve the "Hide Videos" checkbox state using the synchronized Chrome storage API.
        chrome.storage.sync.get("hide", items => {
            const valid = !chrome.runtime.lastError && items.hasOwnProperty("hide");
            this.hidden = valid ? items["hide"] : Manager.DEFAULT_HIDDEN;
            Logger.info("Manager.restore(): Setting hidden to", this.hidden, ".");
        });

        // Retrieve the "View Threshold" slider state using the synchronized Chrome storage API.
        chrome.storage.sync.get("threshold", items => {
            const valid = !chrome.runtime.lastError && items.hasOwnProperty("threshold");
            this.threshold = valid ? items["threshold"] : Manager.DEFAULT_THRESHOLD;
            Logger.info("Manager.restore(): Setting threshold to", this.threshold, ".");
        });
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
            this.fetchShelfVideos(document)
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
                                       || this.fetchShelfVideos(element).length     == 1);
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

    // -----------------------------------------------------------------------------

    // Refreshes the Album associated with this Manager.
    refresh() {
        Logger.info("Manager.refresh():", this.hidden ? "Hiding" : "Showing", "Videos.");
        this.album.refresh(!this.hidden);
    }
}

// -----------------------------------------------------------------------------

// Default "Hide Videos" and "View Threshold" state values.
Manager.DEFAULT_HIDDEN = false;
Manager.DEFAULT_THRESHOLD = 90;

// Time interval to batch poll requests.
Manager.BATCH_TIME = 200;
