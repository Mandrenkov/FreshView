// This file contains the Extractor class and subextractor functions.
// -----------------------------------------------------------------------------

/**
 * A collection of extraction functions that can be used retrieve the videos
 * embedded in a YouTube page.
 */
class Extractor {
    /**
     * Constructs a new Extractor with an empty set of subextractor functions.
     */
    constructor() {
        this.subextractors = new Set();
    }

    /**
     * Extracts the viewed videos embedded inside an HTML element.
     *
     * @todo Replace the manager argument with just a threshold.
     *
     * @param {Element} element - HTML element to extract viewed videos from.
     * @param {*} manager
     * @returns {Video[]} - List of viewed videos.
     */
    extract(element, manager) {
        const subextractors = Array.from(this.subextractors.values());
        const elements = [].concat(...subextractors.map(subextractor => subextractor(element)));

        const videos = elements.map(element => new Video(element, manager));
        const viewed = videos.filter(video => video.getViewed());

        Logger.info("Extractor.extract(): %d/%d Videos on the page were viewed.", viewed.length, videos.length);
        return viewed;
    }

    /**
     * Inserts the given extraction function into this extractor.
     *
     * @param {*} subextractor - Subextractor function to be inserted.
     */
    insert(subextractor) {
        this.subextractors.add(subextractor);
    }

    /**
     * Removes the given extraction function from this extractor.
     *
     * @param {*} subextractor - Subextractor function to be removed.
     */
    remove(subextractor) {
        this.subextractors.delete(subextractor);
    }
}

/**
 * Returns all the grid videos in the given HTML element.
 *
 * @param {Element} element - HTML element to extract videos from.
 *
 * @return {Element[]} - List of HTML grid video elements.
 */
function extractGridVideos(element) {
    return extract(
        element,
        // Videos in the HOME tab of a channel
        "ytd-grid-video-renderer.style-scope.yt-horizontal-list-renderer",
        // Videos in the VIDEOS tab of a channel
        // Videos on the Library page
        // Videos on the Subscriptions page
        "ytd-grid-video-renderer.style-scope.ytd-grid-renderer"
    );
}

/**
 * Returns all the history videos in the given HTML element.
 *
 * @param {Element} element - HTML element to extract videos from.
 *
 * @return {Element[]} - List of HTML history video elements.
 */
function extractHistoryVideos(element) {
    return extract(
        element,
        // Videos on the History page
        "ytd-video-renderer.style-scope.ytd-item-section-renderer[is-history]"
    );
}

/**
 * Extracts all the home videos in the given HTML element.
 * 
 * @param {Element} element - HTML element to extract home videos from.
 * 
 * @return {Element[]} - List of HTML home video elements.
 */
function extractHomeVideos(element) {
    return extract(
        element,
        // Videos on the Home page
        "ytd-rich-item-renderer.style-scope.ytd-rich-grid-row"
    );
}

/**
 * Extracts all the playlist videos in the given HTML element.
 *
 * @param {Element} element - HTML element to extract playlist videos from.
 *
 * @return {Element[]} - List of HTML playlist video elements.
 */
function extractPlaylistVideos(element) {
    return extract(
        element,
        // Videos on a playlist page
        "ytd-playlist-video-renderer.style-scope.ytd-playlist-video-list-renderer",
        // Videos in a playlist panel
        "ytd-playlist-panel-video-renderer.style-scope.ytd-playlist-panel-renderer"
    );
}


/**
 * Extracts all the recommended videos in the given HTML element.
 * 
 * @param {Element} element - HTML element to extract recommended videos from.
 * 
 * @return {Element[]} - List of HTML recommended video elements.
 */
function extractRecommendedVideos(element) {
    return extract(
        element,
        // Videos in the recommendation sidebar
        "ytd-compact-video-renderer.style-scope.ytd-item-section-renderer"
    );
}

/**
 * Returns all the search videos in the given HTML element.
 *
 * @param {Element} element - HTML element to extract videos from.
 *
 * @return {Element[]} - List of HTML search video elements.
 */
function extractSearchVideos(element) {
    return extract(
        element,
        // Videos in a search result that are under a heading
        "ytd-video-renderer.style-scope.ytd-vertical-list-renderer",
        // Videos in a search result that are NOT under a heading
        "ytd-video-renderer.style-scope.ytd-item-section-renderer:not([is-history])"
    );
}

/**
 * Extracts all the videos in the given HTML element that match at least one of
 * the provided CSS selectors. Each of the CSS selectors will be prefixed with
 * ":scope " before being queried.
 * 
 * @param {Element} element - HTML element to extract.
 * @param {string[]} selectors - CSS selectors.
 * 
 * @return {Element[]} - List of HTML video elements.
 */
function extract(element, ...selectors) {
    return [].concat(...selectors.map(selector => Array.from(element.querySelectorAll(`:scope ${selector}`))));
}
