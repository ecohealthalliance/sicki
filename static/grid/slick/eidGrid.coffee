eid = window.eid

options =
  editable: true
  enableAddRow: true
  enableCellNavigation: true
  asyncEditorLoading: false
  autoEdit: false

setUpGrid = (eids) ->
  grid = new Slick.Grid("#myGrid", eids, eid.getColumns(), options)

  grid.setSelectionModel(new Slick.CellSelectionModel())

  grid.onAddNewRow.subscribe (e, args) ->
    item = args.item
    grid.invalidateRow(data.length)
    data.push(item)
    grid.updateRowCount
    grid.render


$ () ->
  promise = eid.getAllEids()
  promise.done (eids) ->
    setUpGrid(eids)
        