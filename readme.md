
# Chrome HAR Viewer

HAR viewer that mimics (or at least tries really hard to) Chrome's network tab.

**[View demo!](https://ericduran.github.com/chromeHAR)**

----
# CHROME NOW SHIPS WITH THIS FUNCTIONALITY
See: https://developers.google.com/web/updates/2017/08/devtools-release-notes#har-imports
----

# Building

```npm install && bower install && grunt server```


##Description##

A HAR viewer that mimics [Chrome Dev Tools Network Panel](https://developers.google.com/chrome-developer-tools/docs/network)


## Current Features
 - Multiple Page HAR File Support
 - Drag and Drop HAR File


###Missing Features
 - Timing Detail View
 - TimeLine Sorting (Start Time, Response Time, End Time, Duration, Latency)
 - Page Speed API (Need to check if pagespeed allows this but it'll be nice.)
 - User Settings (I'm not quiet sure what to put in there yet)
 - Bottom Info - (# of Request, Transfer size, etc..)
 - Off line Support

