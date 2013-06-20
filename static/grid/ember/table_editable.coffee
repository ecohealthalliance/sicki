App.TableEditableExample = Ember.Namespace.create()
App.TableEditableExample.EditableTableCell = Ember.Table.TableCell.extend
  classNames: 'editable-table-cell'
  templateName: 'editable-table-cell'
  isEditing:  no
  type:       'text'

  innerTextField: Ember.TextField.extend
    typeBinding:  'parentView.type'
    valueBinding: 'parentView.cellContent'
    didInsertElement: -> @$().focus()
    blur: (event) ->
      @set 'parentView.isEditing', no

  onRowContentDidChange: Ember.observer ->
    @set 'isEditing', no
  , 'rowContent'

  click: (event) ->
    @set 'isEditing', yes
    event.stopPropagation()

App.TableEditableExample.DatePickerTableCell =
App.TableEditableExample.EditableTableCell.extend
  type: 'date'

App.TableEditableExample.RatingTableCell = Ember.Table.TableCell.extend
  classNames: 'rating-table-cell'
  templateName: 'rating-table-cell'
  didInsertElement: ->
    @_super()
    @onRowContentDidChange()
  applyRating: (rating) ->
    @$('.rating span').removeClass('active')
    span   = @$('.rating span').get(rating)
    $(span).addClass('active')
  click: (event) ->
    rating = @$('.rating span').index(event.target)
    return if rating is -1
    @get('column').setCellContent(@get('rowContent'), rating)
    @applyRating(rating)
  onRowContentDidChange: Ember.observer ->
    @applyRating @get('cellContent')
  , 'cellContent'

App.TableEditableExample.TablesContainer =
Ember.Table.TablesContainer.extend Ember.Table.RowSelectionMixin


App.TableEditableExample.TableController = Ember.Table.TableController.extend
  hasHeader: yes
  hasFooter: no
  numFixedColumns: 0
  numRows: 100
  rowHeight: 30
  selection: null

  columns: Ember.computed ->
    # column names should really come from backend, hardwire for now...
    columnNames = ['event_name', 'disease', 'host', 'location','eid_id','start_date']
    dateColumn = Ember.Table.ColumnDefinition.create
      columnWidth: 100
      headerCellName: 'Date'
      tableCellViewClass: 'App.TableEditableExample.DatePickerTableCell'
      getCellContent: (row) -> row['start_date'].toString('yyyy-MM-dd')
      setCellContent: (row, value) -> row['start_date'] = value
    ratingColumn = Ember.Table.ColumnDefinition.create
      columnWidth: 150
      headerCellName: 'Analyst Rating'
      tableCellViewClass: 'App.TableEditableExample.RatingTableCell'
      contentPath: 'rating'
      setCellContent: (row, value) -> row['rating'] = value
    columns= columnNames.map (key, index) ->
      name = key.charAt(0).toUpperCase() + key.slice(1)
      Ember.Table.ColumnDefinition.create
        columnWidth: 100
        headerCellName: name
        tableCellViewClass: 'App.TableEditableExample.EditableTableCell'
        getCellContent: (row) -> row[key] #row[key].toFixed(2)
        # + sign coerces string into number
        setCellContent: (row, value) -> row[key] = +value
    columns

  getInitialData: ->
    ret = null
    ajx = $.ajax
      url: '../../../eid/events'
      async: false # for now
      dataType: 'json'
      success: (d) -> ret = d
    ret

  # content is actually just the initial data it seems
  content: Ember.computed ->
    @get('getInitialData')()
