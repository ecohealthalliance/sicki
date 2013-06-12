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

    var compOldNew = function(oldVal,newVal) {
        var diffKey = false;
        $.each(oldVal, function(key, val) {
            // for now puntin on arrays - and perhaps forever?
            if ($.isArray(val)) { return true; }
            if (val !== newVal[key]) {
                diffKey = key;
                return false;
            }
        });
        return diffKey;
    }

    var onEdit = function(newVals, oldVals) {
        console.log('got an edit '+newVals[0].map);
        $.each(newVals, function(index, newVal) {
            var diff = compOldNew(oldVals[index],newVal);
            if (diff) {
                console.log("diff "+diff+" "+newVal[diff]);
                // do update
                return false; // break out of iteration
            }
        });
    };

    // watch for edits
    $scope.$watch('events', onEdit, true);

    $('.save').click(function() {
        console.log("clicked "+$scope.events[0]);
    });
});
