/**
 * Network Tab Controller.
 * @param $scope
 */
function NetworkCtrl($scope) {
  'use strict';

  // TODO: Make this more test friendly.
  $scope.entries = $scope.entries || [];
  $scope.data = '';
  $scope.startedTime = '';
  $scope.pageTimings = '';
  $scope.pageTimings.section = '';
  $scope.checked = false;
  $scope.tab = '1';
  $scope.sI = 'all';
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
  }

  $scope.setLabels = function(section) {
    var labels = {};
    for (var i = 12; i > 0; i--) {
      labels[i] = String.sprintf("%0.00fms", section * i);
    };
    return labels;
  }

  $scope.setSort = function(sort) {
    $scope.predicate = sort;
    $scope.reverse = !$scope.reverse;
    console.log(this);
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
    $scope.selectedRow = i;
    $scope.selectedEntry = $scope.entries[i];

    var $leftView = $('.split-view-sidebar-left');
    $('#network-views').removeClass('hidden');
    $('.panel.network').addClass('viewing-resource');
    $leftView.removeClass('maximized');
    $leftView.addClass('minimized');
    $('#network-container').addClass('brief-mode');
  }

  $scope.hideDetails = function() {
    $scope.selectedRow = '-1';
    var $leftView = $('.split-view-sidebar-left');
    $leftView.addClass('maximized');
    $('#network-views').addClass('hidden');
    $('.panel.network').removeClass('viewing-resource');
    $leftView.removeClass('minimized');
    $('#network-container').removeClass('brief-mode');
  }

  // TODO: merge all these get/set index functions.
  $scope.getClass = function (type) {
    return ( (type == $scope.sI) ? 'selected' : '');
  }

  $scope.getSelectedRow = function (i) {
    return ( (i == $scope.selectedRow) ? 'selected' : '');
  }

  $scope.getTab = function(index) {
    return ( (index == $scope.tab) ? 'selected' : '');
  }

  $scope.getVisibleTab = function(index) {
    return ( (index == $scope.tab) ? 'visible' : '');
  }

  $scope.showTab = function(index) {
    $scope.tab = index;
  }
}
