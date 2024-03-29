ENTER_KEY_CODE = 13

Meteor.startup () ->
  FIELDS = @sicki.constants.EID_EVENT_FIELDS
  render = @sicki.render
  eidEventService = @sicki.services.eidEventService
  proposalService = @sicki.services.proposalService
  pathogenService = @sicki.services.pathogenService
  referenceService = @sicki.services.referenceService

  Meteor.subscribe('userData')

  Template.eidDetails.fields = () ->
    event = eidEventService.read(Session.get('selectedId'))
    eidEventFields = []
    for field in _.keys(FIELDS)
      eventField =
        name: field
        label: FIELDS[field].label
      if event[field]
        proposalIds = event[field]
        proposals = proposalService.getWithUsersAndReferences(proposalIds, {sort: {accepted: -1, accepted_date: -1}})
        for proposal in proposals
          proposal.user?.displayName = proposal.user?.profile?.name or proposal.user?.emails?[0]?.address
          proposal.canAccept = Meteor.user()?.admin and !proposal.accepted

          refs = proposal.references
          proposal.refList = ("#{ref.creators?[0]?.lastName} #{ref.date}" for ref in refs).join(', ')

          if field is 'pathogen'
            proposal.pathogen = pathogenService.read(proposal.value)
        eventField.proposals = if proposals then proposals else []
        eventField.topProposalValue = proposals[0]?.pathogen?.reported_name or proposals[0]?.value

      eidEventFields.push(eventField)

    eidEventFields

  setupEvents = () ->
    selectedFieldIndex = _.indexOf _.keys(FIELDS), Session.get('selectedField')

    $('.event-fields').accordion({
      active: selectedFieldIndex
      collapsible: true
      header: '.field-title'
      heightStyle: 'content'
    })

    $('.event-fields .add-proposal-button').click( (event) ->
      fieldName = $(event.target).parents('.event-field').attr('data-field-name')

      valueElement = $(event.target).siblings('.add-proposal-value')
      value = valueElement.attr('data-proposal-value') or valueElement.val()

      referenceIdList = $(event.target).siblings('.reference-list').attr('data-reference-ids')
      refIds = (id for id in referenceIdList.split(',') when id)

      proposal =
        value: value
        date: new Date()
        source: Meteor.userId()
        references: refIds

      eidEventService.addProposal(Session.get('selectedId'), fieldName, proposal)

      Session.set('selectedField', fieldName)
      render()
    )

    $('.event-fields .accept-button').click( (event) ->
      proposalId = $(event.target).parents('.proposal').attr('data-proposal-id')
      proposalService.accept(proposalId)

      fieldName = $(event.target).parents('.event-field').attr('data-field-name')
      Session.set('selectedField', fieldName)
      render()
    )

    Deps.autorun( () ->
      references = referenceService.getTopProposals()
      source = ({
        label: "#{ref.creators?[0]?.lastName} #{ref.date} #{ref.title}",
        value: "#{ref.creators?[0]?.lastName} #{ref.date}",
        referenceId: ref._id
      } for ref in references)
      $('.event-fields .add-proposal-references').autocomplete({
        source: source,
        select: (event, ui) ->
          refList = $(event.target).siblings('.reference-list')
          refList.append(" #{ui.item.value} ")
          oldIdList = refList.attr('data-reference-ids')
          newIdList = if oldIdList then "#{oldIdList},#{ui.item.referenceId}" else "#{ui.item.referenceId}"
          refList.attr('data-reference-ids', newIdList)
          false
      })

      pathogens = pathogenService.read()
      source = ({
        label: pathogen.reported_name,
        pathogenId: pathogen._id
      } for pathogen in pathogens)
      $('.event-field[data-field-name=pathogen] .add-proposal-value').autocomplete({
        source: source,
        select: (event, ui) ->
          $(event.target).attr('data-proposal-value', ui.item.pathogenId)
      })
    )

  @sicki.registerRenderCallback(setupEvents)