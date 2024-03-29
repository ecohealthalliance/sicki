// Generated by CoffeeScript 1.6.3
(function() {
  var eid, options, setUpGrid;

  eid = new Sicki.EID;

  options = {
    editable: true,
    enableAddRow: true,
    enableCellNavigation: true,
    asyncEditorLoading: false,
    autoEdit: false
  };

  setUpGrid = function(eids) {
    var grid;
    grid = new Slick.Grid("#myGrid", eids, eid.getColumns(), options);
    grid.setSelectionModel(new Slick.CellSelectionModel());
    return grid.onAddNewRow.subscribe(function(e, args) {
      var item;
      item = args.item;
      grid.invalidateRow(data.length);
      data.push(item);
      grid.updateRowCount;
      return grid.render;
    });
  };

  $(function() {
    var promise;
    promise = eid.getAllEids();
    return promise.done(function(eids) {
      return setUpGrid(eids);
    });
  });

}).call(this);
