
// See http://groups.google.com/group/http-archive-specification/web/har-1-2-spec
// for HAR specification.

HAREntry = function(entry, id, data) {
  this._entry = entry;
  this._id = id;

  // Response
  this.status = this._entry.response.status;
  this.statusText = this._entry.response.statusText;
  this.mimeType = this._entry.response.content.mimeType
  this.receive = this._entry.timings.receive
  this.receiveTime = this._entry.timings.receive + "ms";

  // Request
  this.url = this._entry.request.url;
  this.method = this._entry.request.method;

  // Custom
  this.parsedURL = new WebInspector.ParsedURL(entry.request.url);
  this.name = this.getRequestName();
  this.folder = this.getFolder();
  this.size = this.getSize();
  this.contentSize = this.getContentSize();
  this.time = this.getTime();
  this.latency = this.getLatency();

  var timeCalculator = new WebInspector.NetworkTransferTimeCalculator();
  var durationCalculator = new WebInspector.NetworkTransferDurationCalculator();

  this._calculators = {};
  this._calculators.timeline = timeCalculator;
  this._calculators.startTime = timeCalculator;
  this._calculators.endTime = timeCalculator;
  this._calculators.responseTime = timeCalculator;
  this._calculators.duration = durationCalculator;
  this._calculators.latency = durationCalculator;
  this.calculator = this._calculators.timeline;
  this.calculator.minimumBoundary = 0;
  this.calculator.maximumBoundary = 100;
  this.request = this.prepRequest();
  this.percentages = this.calculator.computeBarGraphPercentages(this.request);


  // Extra from data.
  this.startedTime = new Date(data.log.pages[0].startedDateTime).getTime();
  this.graphs = this.graphs(data);
  // this.startedDateTime = new Date(this._request.startTime * 1000);
}

HAREntry.prototype = {

  getFolder: function () {
    var path = this.parsedURL.path;
    var indexOfQuery = path.indexOf("?");
    if (indexOfQuery !== -1)
        path = path.substring(0, indexOfQuery);
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

    if (mimeType == 'png') {
      // TODO: Fixme
      // See {WebInspector.NetworkRequest.populateImageSource}
      return '';
    }

    return types[mimeType];
  },

  getSize: function () {
    if (this._entry.cached)
      return 0;
    if (this._entry.response.status === 304) // Not modified
      return Number.bytesToString(this._entry.response.headersSize);

    return Number.bytesToString(this._entry.request.headersSize + this._entry.request.bodySize);
  },

  getContentSize: function () {
    return Number.bytesToString(this._entry.response.content.size);
  },

  getTime: function () {
    if (this._entry.time > 0) {
      return this._entry.time + "ms";
    }
    return 0;
  },

  getLatency: function () {
    if (this._entry.time > 0) {
      return this._entry.time - this._entry.timings.receive + "ms";
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
    graph.pOL = data.log.pages[0].pageTimings.onLoad;
    graph.lOR = this.request.startTime - this.startedTime;
    graph.Lat = this._entry.time - this.receive;
    graph.end = this._entry.time + this.receive;
    graph.latency_left = (graph.lOR  / graph.pOL) * 100;
    graph.latency_right =  100 - (((graph.lOR + graph.Lat) / graph.pOL) * 100);
    graph.receiving_left = ((graph.lOR + graph.Lat)  / graph.pOL) * 100;
    graph.receiving_right = ''; // TODO: Fixme
    return graph;
  }
}

