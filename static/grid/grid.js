var app = angular.module('gridApp', ['ngGrid']);
app.controller('GridCtrl', function($scope) {
    // sicki/eid/events
    var url = '../../eid/events';
    // need to work on getting asynch working
    /*var promise = $.get(url);
    promise.done(function (jsonEvents) {
        $scope.events = JSON.parse(jsonEvents);
        $scope.gridOptions = { data: 'events'};
    });*/
    $.ajax({ url: url,
             async: false, // for now
             success: function(d) { $scope.events = JSON.parse(d); }
           });
    $scope.gridOptions = { data: 'events',
                           enableCellSelection: true,
                           canSelectRows: false,
                           enableCellEdit: true,
                           displaySelectionCheckbox: false,
                           enableColumnResize: true
                         };

    var onEdit = function(newVal, oldVal) {
        alert('got an edit '+newVal);
    };

    // watch for edits
    $scope.$watch('events', onEdit);
});
