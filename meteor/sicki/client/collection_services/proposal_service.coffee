ORIGINAL_DATA_SOURCE = 'original_data'

Meteor.startup () ->
  Proposals = @sicki.collections.Proposals
  services = @sicki.services

  class ProposalService extends @sicki.services.CollectionService

    constructor: () ->
      super 'Proposals', Proposals

    getWithUsers: (idOrIds, options) ->
      proposals = @read(idOrIds, options)
      for proposal in proposals
        if proposal.source isnt ORIGINAL_DATA_SOURCE
          proposal.user = Meteor.users.findOne({_id: proposal.source})
      proposals

    getWithUsersAndReferences: (idOrIds, options) ->
      proposals = @getWithUsers(idOrIds, options)
      for proposal in proposals
        proposal.references = services.referenceService.getTopProposals(proposal.references or [])
      proposals

    accept: (id) ->
      changes =
        accepted: true
        accepted_by: Meteor.userId()
        accepted_date: new Date()
      @update(id, changes)


  @sicki.services.proposalService = new ProposalService()