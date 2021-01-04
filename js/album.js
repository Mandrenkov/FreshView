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
            Logger.warning("Album.add(): failed to add Video", video, ": Video does not have an ID.");
            return;
        }
        this.videos.set(id, video);
    }

    // Updates the given Video in this Album.
    update(video) {
        const id = video.getID();
        if (id === undefined) {
            Logger.warning("Album.update(): failed to update Video", video, ": Video does not have an ID.");
            return;
        }
        video.display = this.videos.get(id).display;
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
        dropped.forEach(id => {this.videos.get(id).show(); this.videos.delete(id);});
        Logger.debug("Album.merge(): dropped Videos", dropped, ".");

        const updated = that.getIDs().filter(id => this.videos.has(id));
        updated.forEach(id => this.update(that.videos.get(id)));
        Logger.debug("Album.merge(): updated Videos", updated, ".");

        const added = that.getIDs().filter(id => !this.videos.has(id));
        added.forEach(id => this.add(that.videos.get(id)));
        Logger.debug("Album.merge(): added Videos", added, ".");
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