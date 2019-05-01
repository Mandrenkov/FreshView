// This file implements the Video class.
// -----------------------------------------------------------------------------

// Video represents a YouTube video element.
class Video {
    // Constructs a new Video from the given HTML element and Manager.
    constructor(element, manager) {
        this.element = element;
        this.manager = manager;
        this.id = this.getID();
        this.title = this.getTitle();
        this.viewed = this.getViewed();
    }

    // Fetches the ID of this Video from the DOM.
    fetchID() {
        let url = this.deriveURL();
        let path = this.derivePath();
        let legal = url && path;
        this.id = legal ? path + url : undefined;
        return this.id;
    }
    
    // Returns the ID of the YouTube URL associated with this Video. 
    deriveURL() {
        let selectors = [
            ":scope a#video-title.yt-simple-endpoint.style-scope.ytd-grid-video-renderer", // Grid
            ":scope a#video-title.yt-simple-endpoint.style-scope.ytd-video-renderer",      // Query
            ":scope a.yt-simple-endpoint.style-scope.ytd-compact-video-renderer",          // Secondary
            ":scope a#video-title.yt-simple-endpoint.style-scope.ytd-video-renderer"       // Shelf, Search
        ];

        // Find the href attribute associated with the HTML element of this Video.
        let href = selectors.reduce((href, selector) => href || this.element.querySelector(selector), null); 
        if (href === null) {
            console.post("Failed to determine ID of Video", this.element, ".");
            return undefined;
        }

        // Parse the ID of the YouTube Video URL.
        let regex = /v=([a-zA-Z0-9_\-]+)/;

        let attribute = href.getAttribute("href");
        let matches = attribute.match(regex);
        if (matches === null) {
            console.post("Failed to find relative Video URL in attribute", attribute, ".");
            return undefined;
        }
        return matches[1];
    }

    // Returns the hierarchical path of the HTML element associated with this Video.
    derivePath() {
        let path = "/";
        let element = this.element;
        while (element.id !== undefined) {
            // The current HTML node can be uniquely identified by its index in
            // the NodeList of its parent HTML node.
            let index = 0;
            for (let sibling = element.previousSibling; sibling !== null; sibling = sibling.previousSibling) {
                ++index;
            }

            // Prepend the ID of the current node to the hierarchical path.
            path = "/" + index + path;
            element = element.parentNode;
        }
        return path;
    }

    // Fetches the title of this Video from the DOM.
    fetchTitle() {
        let title = this.element.querySelector(":scope #video-title[title]");
        if (title === null) {
            console.post("Failed to determine title of Video", this.element, ".");
            return undefined;
        }

        this.title = title.getAttribute("title");
        return this.title;
    }

    // Fetches the view state of this Video from the DOM.
    fetchViewed() {
        let identifier = "div#progress.style-scope.ytd-thumbnail-overlay-resume-playback-renderer";

        let bars = this.element.querySelectorAll(identifier);
        if (bars.length === 0) {
            return undefined;
        }

        let width = bars[0].style.width;
        let progress = parseInt(width.substr(0, width.length - 1));
        this.viewed = progress >= this.manager.threshold;
        return this.viewed;
    }

    // Returns the ID of this Video.
    getID() {
        return this.id || this.fetchID();
    }

    // Returns the title of this Video.
    getTitle() {
        return this.title || this.fetchTitle();
    }

    // Returns the view state of this Video.
    getViewed() {
        return this.viewed || this.fetchViewed();
    }

    // Hides this Video in the DOM.
    hide() {
        this.element.style.setProperty("display", "none");
    }

    // Shows this Video in the DOM.
    show() {
        this.element.style.setProperty("display", "");
    }
}