// The "manager.js" script implements the Manager class.
// -----------------------------------------------------------------------------

// Manager manages a collection of Videos.
class Manager {
    // Constructs a new Manager object.
    constructor() {
        this.videos = [];
        this.delay = undefined;
        this.timeout = undefined;

        // Retrieve the "Hide Videos" checkbox state using the synchronized Chrome storage API.
        chrome.storage.sync.get("hide", items => {
            let valid = !chrome.runtime.lastError && items.hasOwnProperty("hide");
            this.hidden = valid ? items["hide"] : Manager.DEFAULT_HIDDEN;
            console.post("Manager.ctor(): Setting hidden to", this.hidden, ".");
        });

        // Retrieve the "View Threshold" slider state using the synchronized Chrome storage API.
        chrome.storage.sync.get("threshold", items => {
            let valid = !chrome.runtime.lastError && items.hasOwnProperty("threshold");
            this.threshold = valid ? items["threshold"] : Manager.DEFAULT_THRESHOLD;
            console.post("Manager.ctor(): Setting threshold to", this.threshold, ".");
        });

        this.start();
    }

    // Starts the Manager refresh loop.
    start() {
        console.post("Manager.start(): Starting the Manager refresh loop.");
        this.delay = Manager.DEFAULT_DELAY;
        this.timeout = setTimeout(() => this.loop(), 0);
    }

    // Continuously updates the Video collection of this Manager by polling the
    // DOM for new Videos.  The timeout delay of the loop timeout is doubled
    // every iteration of the loop.
    loop() {
        let updated = this.poll();
        this.delay = updated ? Manager.DEFAULT_DELAY : 2*this.delay;
        this.timeout = setTimeout(() => this.loop(), this.delay);
    }

    // Stops the Manager refresh loop and clears any pending refresh timeouts.
    stop() {
        console.post("Manager.stop(): Stopping the Manager refresh loop.");
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = undefined;
    }

    // Polls the DOM for new Videos and updates the Video collection if necessary. 
    poll() {
        let videos = this.fetchVideos();
        let updated = !this.sameVideos(this.videos, videos);
        if (updated) {
            this.updateVideos(videos);
            console.post("Manager.poll(): Updated Videos to", this.videos, ".");
        } else {
            console.post("Manager.poll(): No Video changes were detected.");
        }
        this.refreshVideos();
        return updated;
    }

    // Returns an array containing all the Videos in the current DOM.
    fetchVideos() {
        let elements = [].concat(
            this.fetchAutoplayVideos(),
            this.fetchSectionVideos(document),
            this.fetchGridVideos(document),
            this.fetchSearchVideos(document),
            this.fetchSecondaryVideos(document),
            this.fetchShelfVideos(document)
        );

        let videos = this.uniquify(elements.map(element => new Video(element, this)));
        let viewed = videos.filter(video => video.getViewed());

        console.post("Manager.fetchVideos(): %d/%d Videos on the page were viewed.", viewed.length, videos.length);
        return viewed;
    }

    // Returns an array containing all the section Videos in the given HTML element.
    fetchSectionVideos(element) {
        let elements = Array.from(element.querySelectorAll("ytd-item-section-renderer.style-scope.ytd-section-list-renderer"));
        return elements.filter(element => this.fetchGridVideos(element).length      == 1
                                       || this.fetchSearchVideos(element).length    == 1
                                       || this.fetchSecondaryVideos(element).length == 1 
                                       || this.fetchShelfVideos(element).length     == 1);
    }

    // Returns an array containing all the grid Videos in the given HTML element.
    fetchGridVideos(element) {
        return Array.from(element.querySelectorAll(":scope ytd-grid-video-renderer.style-scope.yt-horizontal-list-renderer")).concat(
               Array.from(element.querySelectorAll(":scope ytd-grid-video-renderer.style-scope.ytd-grid-renderer")));
    }

    // Returns an array containing all the search Videos in the given HTML element.
    fetchSearchVideos(element) {
        return Array.from(element.querySelectorAll(":scope ytd-video-renderer.style-scope.ytd-item-section-renderer")).concat(
               Array.from(element.querySelectorAll(":scope ytd-video-renderer.style-scope.ytd-vertical-list-renderer")));
    }

    // Returns an array containing all the secondary Videos in the given HTML element.
    fetchSecondaryVideos(element) {
        return Array.from(element.querySelectorAll(":scope ytd-compact-video-renderer.style-scope.ytd-watch-next-secondary-results-renderer"));
    }

    // Returns an array containing all the shelf Videos in the given HTML element.
    fetchShelfVideos(element) {
        return Array.from(element.querySelectorAll(":scope ytd-video-renderer.style-scope.ytd-expanded-shelf-contents-renderer"));
    }

    // Returns true if the given arrays of Videos represent the same Videos.
    sameVideos(videosA, videosB) {
        if (videosA === undefined || videosB === undefined) {
            return false;
        }

        let setA = new Set(videosA.map(video => video.getID()));
        let setB = new Set(videosB.map(video => video.getID()));

        // Two Sets are the same if:
        //    1. The Sets contain the same number of elements.
        //    2. Every element in the first Set appears in the second Set.
        let same = true;
        same = same && setA.size == setB.size;
        same = same && Array.from(setA).every(id => setB.has(id));
        return same;
    }

    // Returns a unique array of the given Videos.
    uniquify(videos) {
        let ids = videos.map(video => video.getID());
        return videos.filter((video, index) => ids.indexOf(video.getID()) == index);
    }

    // Updates the collection of Videos belonging to this Manager.
    // Any Videos that are dropped from the collection are reset to their visible state.
    updateVideos(videos) {
        let newIDs = new Set(videos.map(video => video.getID()));
        let droppedVideos = this.videos.filter(video => !newIDs.has(video.getID()));
        droppedVideos.forEach(video => video.show());

        this.videos = videos;
    }

    // Refreshes the visible state of all Videos belonging to this Manager.
    refreshVideos() {
        console.post("Manager.refreshVideos():", this.hidden ? "Hiding" : "Showing", "Videos.");
        this.videos.forEach(video => this.hidden ? video.hide() : video.show());
    }
}

// -----------------------------------------------------------------------------

// Default Manager values.
Manager.DEFAULT_DELAY = 100;
Manager.DEFAULT_HIDDEN = false;
Manager.DEFAULT_THRESHOLD = 90;
