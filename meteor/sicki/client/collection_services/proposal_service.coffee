Meteor.startup () ->
  Proposals = @sicki.collections.Proposals

  class ProposalService extends @sicki.services.CollectionService

    constructor: () ->
      super 'Proposals', Proposals


  @sicki.services.proposalService = new ProposalService()