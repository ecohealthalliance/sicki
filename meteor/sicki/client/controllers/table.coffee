loadDataTable = (tableId, renderCallback) ->
  tableElement = $('#' + "#{tableId}-table")
  if tableElement.length
    table = tableElement.dataTable
      "sDom": "<'table-controls'<'table-control-row'<'span6'l><'filter-control'f>><'table-control-row'<'column-control'C>>r>t<'row-fluid'<'span6'i><'span6'p>>"
      "sPaginationType": "full_numbers"
      "oLanguage":
        "sLengthMenu": "_MENU_ records per page"
      "fnDrawCallback": renderCallback
      "bAutoWidth": false

    numColumns = tableElement.find('th').length
    if numColumns > 5
      table.fnSetColumnVis(i, false) for i in [5...numColumns]

    $('.table-container').show()
    $('.loading-message').hide()


class TableController

  constructor: (@template, @setupEvents) ->

  start: () ->
    selectedTable = Session.get('selectedTable')

    renderField = @template.renderField or (field, value) -> value

    @template.renderTable = (fields, rows) ->
      Template.table({tableId: selectedTable, fields: fields, rows: rows, renderField: renderField})

    renderCallback = @setupEvents or () ->

    window.sicki.registerRenderCallback( () -> loadDataTable(selectedTable, renderCallback))

@sicki ?= {}
@sicki.controllers ?= {}
@sicki.controllers.TableController = TableController

      
      

  