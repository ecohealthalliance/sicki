loadDataTable = (tableId) ->
  tableElement = $('#' + "#{tableId}")
  if tableElement.length
    table = tableElement.dataTable
      "sDom": "<'table-controls'<'table-control-row'<'span6'l><'filter-control'f>><'table-control-row'<'column-control'C>>r>t<'row-fluid'<'span6'i><'span6'p>>"
      "sPaginationType": "full_numbers"
      "oLanguage":
        "sLengthMenu": "_MENU_ records per page"
       "bAutoWidth": false

    table.fnSetColumnVis(i, false) for i in [5...tableElement.find('th').length]

    $('.table-container').show()
    $('.loading-message').hide()


class TableController

  constructor: (@template) ->

  start: () ->
    @template.renderTable = (fields, rows) ->
      Template.table({tableId: Session.get('selectedTable'), fields: fields, rows: rows})

    window.sicki.registerRenderCallback( () -> loadDataTable(Session.get('selectedTable')))

@sicki ?= {}
@sicki.controllers ?= {}
@sicki.controllers.TableController = TableController

      
      

  