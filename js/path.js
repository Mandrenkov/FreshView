// This script implements the Path class.
// -----------------------------------------------------------------------------

// Path extends the URL interface for YouTube pages.
class Path {
    // Extracts the path and query components from the given URL string.
    static parseURL(path) {
        const url = new URL(path);
        return url.pathname + url.search;
    }
}