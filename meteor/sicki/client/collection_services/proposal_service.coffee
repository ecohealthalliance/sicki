ORIGINAL_DATA_SOURCE = 'original_data'

Meteor.startup () ->
  Proposals = @sicki.collections.Proposals

  class ProposalService extends @sicki.services.CollectionService

    constructor: () ->
      super 'Proposals', Proposals

    getWithUsers: (idOrIds, options) ->
      proposals = this.read(idOrIds, options)
      for proposal in proposals
        if proposal.source isnt ORIGINAL_DATA_SOURCE
          proposal.user = Meteor.users.findOne({_id: proposal.source})
          proposal.user.displayName = proposal.user.profile?.name or proposal.user.emails?[0]?.address
      proposals


  @sicki.services.proposalService = new ProposalService()