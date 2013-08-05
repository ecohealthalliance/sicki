Meteor.startup () ->
  FIELDS = @sicki.constants.REFERENCE_FIELDS
  render = @sicki.render
  referenceService = @sicki.services.referenceService


  Template.referenceTable.fields = () ->
    ({name: name, label: FIELDS[name].label} for name in _.keys(FIELDS))

  Template.referenceTable.references = () ->
    refs = referenceService.read()

    references = []
    for ref in refs
      reference = {_id: ref._id, referenceFields: []}
      for field in _.keys(FIELDS)
        if field is 'creators'
          creatorsList = ("#{creator.lastName}, #{creator.firstName}" for creator in ref[field]).join(', ')
          ref[field] = creatorsList

        reference.referenceFields.push({field: field, value: ref[field]})
      references.push(reference)
    references

  loadDataTable = () ->
    if $('#referenceTable').length
      table = $('#referenceTable').dataTable
        "sDom": "<'table-controls'<'table-control-row'<'span6'l><'filter-control'f>><'table-control-row'<'column-control'C>>r>t<'row-fluid'<'span6'i><'span6'p>>"
        "sPaginationType": "full_numbers"
        "oLanguage":
          "sLengthMenu": "_MENU_ records per page"
         "bAutoWidth": false

      table.fnSetColumnVis(i, false) for i in [5..._.keys(FIELDS).length]

      $('.reference-table-container').show()
      $('.loading-message').hide()

  @sicki.registerRenderCallback(loadDataTable)

    