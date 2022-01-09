// This script contains the Album class.
// -----------------------------------------------------------------------------

/**
 * A unique collection of videos.
 */
class Album {
    /**
     * Constructs a new Album object.
     *
     * @param {Video[]?} - Optional array of videos to initialize the album.
     */
    constructor(videos) {
        this.videos = new Map();
        if (videos !== undefined) {
            videos.forEach(video => this.add(video));
        }
    }

    /**
     * Adds the given video to this album.
     *
     * @param {Video} video - Video to be added.
     */
    add(video) {
        const id = video.getID();
        if (id === undefined) {
            Logger.warning("Album.add(): could not add video", video, " because it does not have an ID.");
            return;
        }
        this.videos.set(id, video);
    }

    /**
     * Updates the given video in this album.
     *
     * @param {Video} video - Video to be updated.
     */
    update(video) {
        const id = video.getID();
        if (id === undefined) {
            Logger.warning("Album.update(): could not update video", video, "because it does not have an ID.");
            return;
        }
        video.display = this.videos.get(id).display;
        this.videos.set(id, video);
    }

    /**
     * Reports whether this album has the same content as the given album.
     *
     * @param {Album} that - Album to be compared for equality.
     *
     * @returns {boolean} - True iff the albums contain the same video IDs.
     */
    equals(that) {
        const this_ids = new Set(this.getIDs());
        const that_ids = new Set(that.getIDs());
        return this_ids.size === that_ids.size && this_ids.every(id => that_ids.has(id));
    }

    /**
     * Merges this album with the given album, refreshing videos as needed.
     *
     * @param {Album} that - Album to be merged into this album.
     */
    merge(that) {
        const dropped = this.getIDs().filter(id => !that.videos.has(id));
        dropped.forEach(id => {this.videos.get(id).show(); this.videos.delete(id);});
        Logger.debug("Album.merge(): dropped videos", dropped, ".");

        const updated = that.getIDs().filter(id => this.videos.has(id));
        updated.forEach(id => this.update(that.videos.get(id)));
        Logger.debug("Album.merge(): updated videos", updated, ".");

        const added = that.getIDs().filter(id => !this.videos.has(id));
        added.forEach(id => this.add(that.videos.get(id)));
        Logger.debug("Album.merge(): added videos", added, ".");
    }

    /**
     * Returns the IDs of the videos in this album.
     */
    getIDs() {
        return Array.from(this.videos.keys());
    }

    /**
     * Returns the videos in this album.
     */
    getVideos() {
        return Array.from(this.videos.values());
    }

    /**
     * Returns the number of videos in this album.
     */
    getSize() {
        return this.videos.size;
    }
}