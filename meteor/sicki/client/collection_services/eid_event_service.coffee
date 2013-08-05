Meteor.startup () ->
  EIDEvents = @sicki.collections.EIDEvents
  services = @sicki.services

  class EIDEventService extends @sicki.services.CollectionService

    constructor: () ->
      super 'EIDEvents', EIDEvents

    addProposal: (eventId, field, proposal) ->
      proposalId = services.proposalService.create(proposal)
      event = @read(eventId)
      proposalChanges = {}
      proposalChanges[field] = event[field] or []
      proposalChanges[field].push(proposalId)
      @update(eventId, proposalChanges)
      proposalId

  @sicki.services.eidEventService = new EIDEventService()