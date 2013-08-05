Meteor.startup () ->
  FIELDS = @sicki.constants.REFERENCE_FIELDS
  render = @sicki.render
  referenceService = @sicki.services.referenceService


  Template.referenceTable.fields = () ->
    ({name: name, label: FIELDS[name].label} for name in _.keys(FIELDS))

  Template.referenceTable.rows = () ->
    refs = referenceService.read()

    rows = []
    for ref in refs
      row = {_id: ref._id, data: []}
      for field in _.keys(FIELDS)
        if field is 'creators'
          creatorsList = ("#{creator.lastName}, #{creator.firstName}" for creator in ref[field]).join(', ')
          ref[field] = creatorsList

        row.data.push({field: field, value: ref[field]})
      rows.push(row)
    rows

  Template.referenceTable.renderTable = (fields, rows) ->
    Template.table({fields: fields, rows: rows})

  loadDataTable = () ->
    if $('.data-table').length
      table = $('.data-table').dataTable
        "sDom": "<'table-controls'<'table-control-row'<'span6'l><'filter-control'f>><'table-control-row'<'column-control'C>>r>t<'row-fluid'<'span6'i><'span6'p>>"
        "sPaginationType": "full_numbers"
        "oLanguage":
          "sLengthMenu": "_MENU_ records per page"
         "bAutoWidth": false

      table.fnSetColumnVis(i, false) for i in [5..._.keys(FIELDS).length]

      $('.table-container').show()
      $('.loading-message').hide()

  @sicki.registerRenderCallback(loadDataTable)

    