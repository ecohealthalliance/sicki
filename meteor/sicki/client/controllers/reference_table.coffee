Meteor.startup () ->
  FIELDS = @sicki.constants.REFERENCE_FIELDS
  referenceService = @sicki.services.referenceService
  TableController = @sicki.controllers.TableController

  Template.referenceTable.fields = () ->
    ({name: name, label: FIELDS[name].label} for name in _.keys(FIELDS))

  Template.referenceTable.rows = () ->
    ({
      _id: ref._id
      data: ({field: field, value: ref[field]} for field in _.keys(FIELDS))
    } for ref in referenceService.read())

  Template.referenceTable.renderField = (field, value) ->
    switch field
      when 'creators' then ("#{creator.lastName}, #{creator.firstName}" for creator in value)
      else value

  controller = new TableController('references', Template.referenceTable)
  controller.start()