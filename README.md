<h1>
  <img src="img/icon24.png"/> FreshView for YouTube™
</h1>

FreshView for YouTube™ is a Chrome extension that hides YouTube™ videos which users have already watched.

---

#### Repository Layout

The contents of the top-level directories match their names exactly:

| **Directory**    | **Contents**     |
| :--------        | :--------        |
| [assets](assets) | Asset files      |
| [css](css)       | CSS files        |
| [html](html)     | HTML files       |
| [img](img)       | Icon files       |
| [js](js)         | JavaScript files |

The [js](js) directory contains the following scripts:

| **File**                          | **Purpose**                                            |
| :---                              | :---                                                   |
| [album.js](js/album.js)           | Implements a container for Videos.                     |
| [background.js](js/background.js) | Activates the extension in the Chrome toolbar.         |
| [injection.js](js/injection.js)   | Attaches listeners to Chrome storage events.           |
| [logger.js](js/logger.js)         | Wraps `console` to control the visibility of messages. |
| [manager.js](js/manager.js)       | Finds and manages Videos on a page.                    |
| [popup.js](js/popup.js)           | Attaches listeners to the extension UI.                |
| [video.js](js/video.js)           | Implements a model for YouTube™ videos.                |

#### How it Works

Occasionally, FreshView queries the DOM for HTML elements that match the expected structure of a YouTube™ video.  Each HTML element that matches the structure of a YouTube™ video is converted into a `Video`.  All Videos with a view progress that meets or exceeds the current view threshold are added to a dynamic collection of Videos known as an `Album`.  When a Video is added to an Album, it is displayed or hidden depending on the current state of the UI checkbox.  Similarly, when a Video is removed from an Album, it is reverted to a visible state.

##### Technical Notes
1. The visibility of a Video is controlled by setting the `display` attribute of a YouTube™ video element's `style`.
1. The view progress of a Video is derived from the red bar shown along the bottom of a YouTube™ video element.
1. Attribute mutations do not contribute to DOM query requests.
1. Mutations that occur within 200 millisecond intervals are grouped together into a single DOM query request.
1. The view threshold slider is only synced on `mouseup` events to avoid exceeding the `chrome.storage.sync` quota.

### Screenshots

#### Screenshot 1
![FreshView for YouTube™ UI](assets/popup.png "FreshView for YouTube™ UI")

#### Screenshot 2
![Video Progress Demonstration](assets/progress.png "Video Progress Demonstration")