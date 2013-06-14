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
                           enableColumnResize: true,
                           enableSorting: true
                         };

    var compOldNew = function(oldVal,newVal) {
        var diffKey = false;
        $.each(oldVal, function(key, val) {
            // for now punting on arrays - and perhaps forever?
            if ($.isArray(val)) return true;
            if (val !== newVal[key]) {
                diffKey = key;
                return false; // iteration break
            }
        });
        return diffKey;
    }

    // update backend
    var update = function(newRow,diffField) {
        var eid = newRow.id;
        var url = "../../eid/update/"+eid;
        var newValue = {};
        newValue[diffField] = newRow[diffField];
        var dataPromise = $.ajax({
            url: url,
            type: 'PUT',
            data: newValue
        });
        dataPromise.done(function(msg) {
            console.log("done "+msg);
        });
        dataPromise.fail(function(err) {
            console.log("Failed "+err);
        });
    }

    var onEdit = function(newTable, oldTable) {
        var diffField = false;
        $.each(newTable, function(index, newRow) {
            diffField = compOldNew(oldTable[index],newRow);
            console.log("diffed "+newRow.id+' '+diffField);
            if (diffField) {
                console.log("diff "+diffField+" "+newRow[diffField]
                            +" eid "+newRow.id);
                // do update
                update(newRow,diffField);
            }
            if (diffField) return false; // done break out of iter
        });
    };

    // watch for edits
    $scope.$watch('events', onEdit, true);

    $('.save').click(function() {
        console.log("clicked "+$scope.events[0]);
    });
});
