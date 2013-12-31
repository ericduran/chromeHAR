/**
 * Network Tab Controller.
 */

(function(ng, $) {
  'use strict';

  // Yo, ng === angular FYI :-p I don't like typing "angular" so much.
  var cH = ng.module('net', ['net']);

  // Network Controller.
  cH.controller('NetworkCtrl', function ($scope) {

    $scope.segments = 12; // Hard-coded number of segments
    $scope.pages = $scope.pages || []; // Page -> Entry mapping
    $scope.entries = $scope.entries || []; // Entries
    $scope.data = {}; // Global data

    $scope.checked = false;
    $scope.tab = '1';
    $scope.sI = 'all';
    $scope.selectedEntry = null;

    $scope.updateHar = function(newData) {
      // Reset data
      var data = {};
      data.lastOnLoad = 0;

      // Handle pages.
      var pages = newData.log.pages;
      var pageidxs = {};
      $.each(pages, function(i, pg) {
        pageidxs[pg.id] = i;
        pg.startTime = new Date(pg.startedDateTime).getTime();
        // Set last onLoad (upper bound on scale).
        if (!data.lastOnLoad || data.lastOnLoad < pg.pageTimings.onLoad ) {
          data.lastOnLoad = pg.pageTimings.onLoad;
        }
        pg.transfer = 0; // Reset transfer size
      });

      // Handle entries
      var entries = newData.log.entries;
      delete newData.log.entries;
      $.each(entries, function(i, entry) {
        var pg = pages[pageidxs[entry.pageref]];
        entries[i] = new HAREntry(entry, i, pg.startTime, data);
        if (!pg.entries) {
          pg.entries = [];
        }
        pg.entries.push(entries[i]); // Record reference
        pg.transfer += entries[i].getRawContentSize();
      });

      $.each(pages, function(i, pg) {
        pg.transfer = Number.bytesToString(pg.transfer);
        pg.count = 0;
        if (pg.entries) {
          pg.count = pg.entries.length;
        }
        pg.loadEventLeft = (pg.pageTimings.onLoad/data.lastOnLoad) * 100;
        if (pg.pageTimings.onContentLoad) {
          pg.contentLoadLeft = (pg.pageTimings.onContentLoad/data.lastOnLoad)*100;
        }
        else {
          pg.contentLoadLeft = 0;
        }
      });


      // Latch values
      $scope.entries = entries;
      $scope.pages = pages;
      $scope.checked = true;
      $scope.data = data;

      // Create labels for segments
      $scope.labels = $scope.setLabels($scope.data.lastOnLoad/$scope.segments);
    };

    $scope.setLabels = function(section) {
      var labels = {};
      for (var i = 12; i > 0; i--) {
        labels[i] = String.sprintf("%0.00fms", section * i);
      };
      return labels;
    };

    $scope.setSort = function(sort) {
      $scope.predicate = sort;
      $scope.reverse = !$scope.reverse;
    };

    $scope.toggleReqHeaders = function() {
      $('.request.parent').toggleClass('expanded');
      $('.request.children').toggleClass('expanded');
    };

    $scope.toggleResHeaders = function() {
      $('.response.parent').toggleClass('expanded');
      $('.response.children').toggleClass('expanded');
    };

    $scope.showDetails = function(i, entry) {
      $scope.selectedRow = i;
      $scope.selectedEntry = entry;

      var $leftView = $('.split-view-sidebar-left');
      $('#network-views').removeClass('hidden');
      $('.panel.network').addClass('viewing-resource');
      $leftView.removeClass('maximized');
      $leftView.addClass('minimized');
      $('#network-container').addClass('brief-mode');
    };

    $scope.hideDetails = function() {
      $scope.selectedRow = '-1';
      var $leftView = $('.split-view-sidebar-left');
      $leftView.addClass('maximized');
      $('#network-views').addClass('hidden');
      $('.panel.network').removeClass('viewing-resource');
      $leftView.removeClass('minimized');
      $('#network-container').removeClass('brief-mode');
    };

    // TODO: merge all these get/set index functions.
    $scope.getClass = function (type) {
      return ( (type == $scope.sI) ? 'selected' : '');
    };

    $scope.getSelectedRow = function (i) {
      return ( (i == $scope.selectedRow) ? 'selected' : '');
    };

    $scope.getTab = function(index) {
      return ( (index == $scope.tab) ? 'selected' : '');
    };

    $scope.getVisibleTab = function(index) {
      return ( (index == $scope.tab) ? 'visible' : '');
    };

    $scope.showTab = function(index) {
      $scope.tab = index;
    };

    $scope.dnd = {};

    $scope.dnd.cancel = function (e) {
      if (e.preventDefault) {
        e.preventDefault(); // required by FF + Safari
      }
      return false; // required by IE
    }

    $scope.$watch('inputFile', function(e) {
      if ($scope.inputFile !== undefined) {
        var file = $scope.inputFile;
        var reader = new FileReader();
        reader.onload = function (event) {
          try {
            var data = JSON.parse(event.target.result);
            $('#dropArea').removeClass('visible');
            $scope.$apply(function() {
              $scope.updateHar(data);
            });
          }
          catch (e) {
            // For now lets just throw an alert.
            alert('Unsupported file type.');
          }
        }
        reader.readAsText(file);
      }
    });

    $scope.dnd.drop = function ($event) {
      var e, file, reader, data;
      $event.preventDefault();
      $event.stopPropagation();
      e = $event.originalEvent;
      file = e.dataTransfer.files[0];
      reader = new FileReader();
      reader.onload = function (event) {
        try {
          data = JSON.parse(event.target.result);
          $('#dropArea').removeClass('visible');
          $scope.$apply(function() {
            $scope.updateHar(data);
          });
        }
        catch (e) {
          // For now lets just throw an alert.
          alert('Unsupported file type.');
        }
      }
      reader.readAsText(file);
      return false;
    };

  });


  /**
   * Angular Drag and Drop Event bindings.
   *
   * @example <div dnd-dragover="blah()">
   * @example <div dnd-dragEnd="blah()">
   * @example <div dnd-drop="blah()">
   */
  ['Dragstart', 'Drag', 'Dragenter', 'Dragleave', 'Dragover', 'Drop', 'Dragend'].forEach(
    function(name) {
      'use strict';
      var directiveName = 'dnd' + name;
      cH.directive(directiveName, ['$parse', function($parse, $scope) {
        return function(scope, element, attr) {
          var fn = $parse(attr[directiveName]);
          element.bind(name.toLowerCase(), function(event) {
            scope.$apply(function() {
              fn(scope, {$event:event});
            });
          });
        };
      }]);
    }
  );

  /**
   * Angular File Reader.
   *
   * @example <file name="har" ng-model="inputFile" accept="*" />
   */
  cH.directive('file', function() {
    return {
      restrict: 'E',
      template: '<input type="file" />',
      replace: true,
      require: 'ngModel',
      link: function(scope, element, attr, ctrl) {
        var listener = function() {
          scope.$apply(function() {
            attr.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
          });
        }
        element.bind('change', listener);
      }
    }
  });

})(angular, jQuery);
