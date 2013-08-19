ENTER_KEY_CODE = 13

Meteor.startup () ->
  FIELDS = @sicki.constants.REFERENCE_FIELDS
  render = @sicki.render
  referenceService = @sicki.services.referenceService
  proposalService = @sicki.services.proposalService

  Template.referenceDetails.fields = () ->
    reference = referenceService.read(Session.get('selectedId'))
    referenceFields = []
    for field in _.keys(FIELDS)
      referenceField =
        name: field
        label: FIELDS[field].label
      if reference[field]
        proposalIds = reference[field]
        proposals = proposalService.getWithUsers(proposalIds, {sort: {accepted: -1, accepted_date: -1}})
        for proposal in proposals
          proposal.user?.displayName = proposal.user?.profile?.name or proposal.user?.emails?[0]?.address
          proposal.canAccept = Meteor.user()?.admin and !proposal.accepted

          if field is 'creators'
            proposal.creatorList = ("#{creator.firstName} #{creator.lastName}" for creator in proposal.value).join(', ')

        referenceField.proposals = if proposals then proposals else []
        referenceField.topProposalValue = proposals[0]?.creatorList or proposals[0]?.value
      referenceFields.push(referenceField)
    referenceFields

  setupEvents = () ->
    selectedFieldIndex = _.indexOf _.keys(FIELDS), Session.get('selectedField')

    $('.reference-fields').accordion({
      active: selectedFieldIndex
      collapsible: true
      header: '.field-title'
      heightStyle: 'content'
    })

    $('.reference-fields .add-proposal-button').click( (event) ->
      fieldName = $(event.target).parents('.reference-field').attr('data-field-name')

      value = $(event.target).siblings('.add-proposal-value').val()
      if fieldName is 'creators'
        creatorNames = value.split(',')
        value = []
        for name in creatorNames
          [first, last] = name.trim().split(' ')
          value.push({firstName: first, lastName: last})

      proposal =
        value: value
        date: new Date()
        source: Meteor.userId()

      referenceService.addProposal(Session.get('selectedId'), fieldName, proposal)

      Session.set('selectedField', fieldName)
      render()
    )

    $('.reference-fields .accept-button').click( (event) ->
      proposalId = $(event.target).parents('.proposal').attr('data-proposal-id')
      proposalService.accept(proposalId)

      fieldName = $(event.target).parents('.reference-field').attr('data-field-name')
      Session.set('selectedField', fieldName)
      render()
    )

  @sicki.registerRenderCallback(setupEvents)