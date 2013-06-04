var app = angular.module('gridApp', ['ngGrid']);
app.controller('GridCtrl', function($scope) {
    var url = '/sicki/eid/events';
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
});
