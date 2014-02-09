/**
 * HAREntry
 *
 * Represents a single request in in the HAR file. Most HAR files will contain
 * multiple requests.
 *
 * @author Eric J. Duran
 * @see http://groups.google.com/group/http-archive-specification/web/har-1-2-spec
 */
var HAREntry = (function HAREntryClosure() {
  'use strict';

  /**
   * A single entry request.
   * @constructor
   */
  function HAREntry(entry, id, start_time, data) {
    this._entry = entry;
    this._id = id;

    // Response
    this.status = this._entry.response.status;
    this.statusText = this._entry.response.statusText;
    this.mimeType = this._entry.response.content.mimeType;
    this.receive = this.getReceive();
    this.wait = this.getWait();

    // Request
    this.url = this._entry.request.url;
    this.method = this._entry.request.method;

    // Custom
    this.parsedURL = new WebInspector.ParsedURL(entry.request.url);
    if (!this.parsedURL.lastPathComponent) {
      if (this.parsedURL.url.indexOf('?') > -1) {
        // Show the querystring parameters.
        this.parsedURL.lastPathComponent = '?' + this.parsedURL.queryParams;
      } else {
        // Show the the hostname.
        this.parsedURL.lastPathComponent = this.parsedURL.host;
      }
    }
    this.name = this.getRequestName();
    this.folder = this.getFolder();
    this.size = this.getSize();
    this.contentSize = this.getContentSize();
    this.time = this.getTime();
    this.latency = this.getLatency();

    // var timeCalculator = new WebInspector.NetworkTransferTimeCalculator();
    // var durationCalculator = new WebInspector.NetworkTransferDurationCalculator();

    this.request = this.prepRequest();
    this.reqHeadersCount = this._entry.request.headers.length;
    this.resHeadersCount = this._entry.response.headers.length;

    // Extra from data.
    this.startedTime = start_time;
    this.graphs = this.graphs(data);

    // Raw values for Sort and Filters.
    this.nameSort = this.parsedURL.lastPathComponent;
    this.timeSort = this._entry.time;
    this.sizeSort = '';
  }

  HAREntry.prototype = {

    getFolder: function () {
      var path = this.parsedURL.path;
      var indexOfQuery = path.indexOf("?");
      if (indexOfQuery !== -1) {
          path = path.substring(0, indexOfQuery);
      }

      var lastSlashIndex = path.lastIndexOf("/");
      return lastSlashIndex !== -1 ? path.substring(0, lastSlashIndex) : "";
    },

    getRequestName: function () {
      var types = [];
      var mimeType = this._entry.response.content.mimeType;
      types['text/html'] = 'document';
      types['text/css'] = 'stylesheet';
      types['text/javascript'] = 'script';
      types['application/javascript'] = 'script';
      types['image/png'] = 'image';
      types['image/gif'] = 'image';
      types['image/jpeg'] = 'image';

      return types[mimeType];
    },

    getSize: function () {
      // TODO: Fixme, this doesn't correctly pick up items from cache.
      if (this._entry.cached) {
        return 0;
      }
      if (this._entry.response.status === 304) {
        // Not modified
        return Number.bytesToString(this._entry.response.headersSize);
      }

      return Number.bytesToString(this._entry.response.headersSize + this._entry.response.bodySize);
    },

    getContentSize: function () {
      return Number.bytesToString(this._entry.response.content.size);
    },

    getRawContentSize: function () {
      return this._entry.response.content.size;
    },

    getTime: function () {
      if (this._entry.time > 0) {
        return this._entry.time;
      }
      return 0;
    },

    getLatency: function () {
      if (this._entry.time > 0) {
        return this._entry.time - this._entry.timings.receive;
      }
      return 0;

    },

    getReceive: function() {
      if (this._entry.timings && this._entry.timings.receive != undefined) {
        return this._entry.timings.receive;
      }
      return 0;
    },

    getWait: function() {
      if (this._entry.timings && this._entry.timings.wait != undefined) {
        return this._entry.timings.wait;
      }
      return 0;
    },

    prepRequest: function () {
      var request = {};
      request.startTime = new Date(this._entry.startedDateTime).getTime();
      request.responseReceivedTime = request.startTime;
      request.endTime = request.startTime + this._entry.time;
      this.minimumBoundary = 0;
      this.boundarySpan = 100;
      this.diff = request.endTime - request.responseReceivedTime;
      return request;
    },

    graphs: function (data) {
      var graph = {};
      graph.pOL = data.lastOnLoad;
      graph.lOR = this.request.startTime - this.startedTime;
      graph.Lat = this._entry.time - this.receive;
      graph.end = this._entry.time + this.receive;
      graph.latency_left = (graph.lOR  / graph.pOL) * 100;
      graph.latency_right =  100 - (((graph.lOR + graph.Lat) / graph.pOL) * 100);
      graph.receiving_left = ((graph.lOR + graph.Lat)  / graph.pOL) * 100;
      graph.receiving_right = 100.0 - ((graph.lOR + this._entry.time)/graph.pOL * 100);
      return graph;
    }
  };

  return HAREntry;
})();
