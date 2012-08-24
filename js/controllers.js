
function EntryListCtrl($scope, $http) {
  $http.get('screenshot.json').success(function(data) {
    $.each(data.log.entries, function(i, entry) {
      data.log.entries[i] = new HAREntry(entry, i);
    });
    $scope.entries = data.log.entries;
    data.count = data.log.entries.length;
    delete data.log.entries;
    $scope.data = data;
    $scope.startedTime = new Date(data.log.pages[0].startedDateTime).getTime();
    $scope.pageTimings = data.log.pages[0].pageTimings;
    $scope.pageTimings.section = $scope.pageTimings.onLoad / 12;
  });
}
