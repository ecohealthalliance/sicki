Meteor.startup () ->
  FIELDS = @sicki.constants.REFERENCE_FIELDS
  referenceService = @sicki.services.referenceService
  TableController = @sicki.controllers.TableController

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

  controller = new TableController(Template.referenceTable)
  controller.start()