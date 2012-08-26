
function NetworkCtrl($scope, $http) {
  $scope.entries = [];
  $scope.data = '';
  $scope.startedTime = '';
  $scope.pageTimings = '';
  $scope.pageTimings.section = '';
  $scope.checked = false;
  $scope.tab = '1';
  $scope.selectedEntry;

  $scope.updateHar = function(data) {
    $scope.transfer = 0;
    var entries = data.log.entries;
    data.count = data.log.entries.length;
    delete data.log.entries;
    $.each(entries, function(i, entry) {
      entries[i] = new HAREntry(entry, i, data);
      $scope.transfer += entries[i].getRawContentSize();
    });
    $scope.entries = entries;
    $scope.checked = true;
    $scope.data = data;
    $scope.startedTime = new Date(data.log.pages[0].startedDateTime).getTime();
    $scope.pageTimings = data.log.pages[0].pageTimings;
    $scope.pageTimings.section = $scope.pageTimings.onLoad / 12;
    $scope.transfer = Number.bytesToString($scope.transfer);
    $scope.labels = $scope.setLabels($scope.pageTimings.section);
    console.log($scope);
  }

  $scope.setLabels = function(section) {
    var labels = {};
    for (var i = 12; i > 0; i--) {
      labels[i] = String.sprintf("%0.00fms", section * i);
    };
    return labels;
  }

  $scope.toggleReqHeaders = function() {
    $('.request.parent').toggleClass('expanded');
    $('.request.children').toggleClass('expanded');
  }

  $scope.toggleResHeaders = function() {
    $('.response.parent').toggleClass('expanded');
    $('.response.children').toggleClass('expanded');
  }

  $scope.showDetails = function(i) {
    $scope.selectedEntry = $scope.entries[i];

    var $leftView = $('.split-view-sidebar-left');
    $('#network-views').removeClass('hidden');
    $('.panel.network').addClass('viewing-resource');
    $leftView.removeClass('maximized');
    $leftView.addClass('minimized');
    $('#network-container').addClass('brief-mode');
    $('col:not(.first)').hide().width('0');
    $('col.first').width('100%');
  }

  $scope.hideDetails = function() {
    var $leftView = $('.split-view-sidebar-left');
    $leftView.addClass('maximized');
    $('#network-views').addClass('hidden').
    $('.panel.network').removeClass('viewing-resource');
  }

  $scope.sI = 'all'; // Selected Index;
  $scope.getClass = function (type) {
    if (type == $scope.sI) {
      return 'selected';
    }
    else {
      return '';
    }
  }

  $scope.getTab = function(index) {
    if (index == $scope.tab) {
      return 'selected';
    }
    else {
      return '';
    }
  }
  $scope.getVisibleTab = function(index) {
    if (index == $scope.tab) {
      return 'visible';
    }
    else {
      return '';
    }
  }

  $scope.showTab = function(index) {
    $scope.tab = index;
  }
}
