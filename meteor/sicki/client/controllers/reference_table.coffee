Meteor.startup () ->
  FIELDS = @sicki.constants.REFERENCE_FIELDS
  render = @sicki.render
  referenceService = @sicki.services.referenceService
  proposalService = @sicki.services.proposalService
  TableController = @sicki.controllers.TableController

  Template.referenceTable.fields = () ->
    ({name: name, label: FIELDS[name].label} for name in _.keys(FIELDS))

  Template.referenceTable.rows = () ->
    refs = referenceService.read()
    mongoProposals = proposalService.find({accepted: true})
    proposals = {}
    for proposal in mongoProposals
      proposals[proposal._id] = proposal

    rows = []
    for ref in refs
      row = {_id: ref._id, data: []}
      for field in _.keys(FIELDS)
        if ref[field]
          refProposals = (proposals?[proposalId] for proposalId in ref[field] when proposalId)
          lastAcceptedProposal = _.max(refProposals, (p) -> p?.accepted_date or null)
          row.data.push({field: field, value: lastAcceptedProposal?.value})
        else
          row.data.push({field: field, value: ""})
      rows.push(row)
    rows

  Template.referenceTable.renderField = (field, value) ->
    switch field
      when 'creators' then ("#{creator.lastName}, #{creator.firstName}" for creator in value)
      else value

  setupEvents = () ->
    $('td').click( () ->
      id = $(event.target).parent().attr('data-id')
      Session.set('selectedId', id)
      render()
    )

  controller = new TableController('references', Template.referenceTable, setupEvents)
  controller.start()