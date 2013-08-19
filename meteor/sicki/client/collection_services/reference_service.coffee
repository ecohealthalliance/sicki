Meteor.startup () ->
  References = @sicki.collections.References
  services = @sicki.services

  class ReferenceService extends @sicki.services.CollectionService

    constructor: () ->
      super 'References', References

    addProposal: (referenceId, field, proposal) ->
      proposalId = services.proposalService.create(proposal)
      event = @read(referenceId)
      proposalChanges = {}
      proposalChanges[field] = event[field] or []
      proposalChanges[field].push(proposalId)
      @update(referenceId, proposalChanges)
      proposalId

    getTopProposals: (referenceIds) ->
      mongoProposals = services.proposalService.read()
      proposals = {}
      for proposal in mongoProposals
        proposals[proposal._id] = proposal

      references = @read(referenceIds)
      results = []
      for ref in references
        result = {_id: ref._id}
        for field in ['creators', 'date', 'title']
          if ref[field]
            refProposals = (proposals?[proposalId] for proposalId in ref[field] when proposalId)
            lastAcceptedProposal = _.max(refProposals, (p) -> p?.accepted_date or null)
            result[field] = lastAcceptedProposal?.value
        results.push(result)
      results
        


  @sicki.services.referenceService = new ReferenceService()