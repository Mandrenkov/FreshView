// This script implements the Album class.
// -----------------------------------------------------------------------------

// Album represents a collection of Videos.
class Album {
    // Constructs a new Album.
    constructor() {
        this.videos = new Map();
    }

    // Adds the given Video to this Album.
    add(video) {
        const id = video.getID();
        if (id === undefined) {
            Logger.warning("Album.add(): Failed to add Video", video, ": Video does not have an ID.");
            return;
        }
        this.videos.set(id, video);
    }

    // Reports whether the given Album is tha same as this Album.
    equals(that) {
        // Two Albums are the same if:
        //    1. The Albums contain the same number of Videos.
        //    2. Every ID in the first Album appears in the second Album.
        return this.getSize() === that.getSize() &&
               this.getIDs().every(id => that.videos.has(id));
    }

    // Merges this Album with the given Album, refreshing Videos as needed.
    merge(that) {
        const dropped = this.getIDs().filter(id => !that.videos.has(id));
        dropped.forEach(id => {this.videos.get(id).show(); this.videos.delete(id)});
        Logger.info("Album.merge(): Dropped", dropped, ".");

        const added = that.getIDs().filter(id => !this.videos.has(id));
        added.forEach(id => this.add(that.videos.get(id)));
        Logger.info("Album.merge(): Added", added, ".");
    }

    // Refreshes the visibility of all Videos in this Album.
    refresh(visible) {
        this.getVideos().forEach(video => visible ? video.show() : video.hide());
    }

    // Returns the IDs of the Videos in this Album.
    getIDs() {
        return Array.from(this.videos.keys())
    }

    // Returns the Videos in this Album.
    getVideos() {
        return Array.from(this.videos.values())
    }

    // Returns the number of Videos in this Album.
    getSize() {
        return this.videos.size;
    }
}