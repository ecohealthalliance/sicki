ENTER_KEY_CODE = 13

FIELDS =
Meteor.startup () ->
  FIELDS = @sicki.constants.EID_EVENT_FIELDS
  render = @sicki.render
  eidEventService = @sicki.services.eidEventService
  proposalService = @sicki.services.proposalService
  pathogenService = @sicki.services.pathogenService
  referenceService = @sicki.services.referenceService

  Meteor.subscribe('userData')

  Template.eidEvent.fields = () ->
    event = eidEventService.read(Session.get('selectedEventId'))
    eidEventFields = []
    for field in _.keys(FIELDS)
      eventField =
        name: field
        label: FIELDS[field].label
      if event[field]
        proposalIds = event[field]
        proposals = proposalService.read(proposalIds, {sort: {accepted: -1}})
        for proposal in proposals
          if proposal.source != 'original_data'
            user = Meteor.users.findOne({_id: proposal.source})
            proposal.userDisplayName = user.profile?.name or user.emails?[0]?.address
          proposal.canAccept = Meteor.user()?.admin and !proposal.accepted
          proposal.proposalId = proposal._id.toHexString()

          refs = referenceService.read(proposal.references or [])
          proposal.refList = ("#{ref.creators?[0]?.lastName} #{ref.date}" for ref in refs).join(', ')

          if field is 'pathogen'
            proposal.pathogen = pathogenService.read(proposal.value)
        eventField.proposals = if proposals then proposals else []

      eidEventFields.push(eventField)

    eidEventFields

  setupEvents = () ->
    $('.add-proposal-button').click( (event) ->
      fieldName = $(event.target).parents('.event-field').attr('data-field-name')

      valueElement = $(event.target).siblings('.add-proposal-value')
      value = valueElement.attr('data-proposal-value') or valueElement.val()

      referenceIdList = $(event.target).siblings('.reference-list').attr('data-reference-ids')
      refIds = (id for id in referenceIdList.split(',') when id)

      id = proposalService.create({value: value, date: new Date(), source: Meteor.userId(), references: refIds})

      event = eidEventService.read(Session.get('selectedEventId'))
      proposals = {}
      proposals[fieldName] = event[fieldName] or []
      proposals[fieldName].push(id)
      eidEventService.update(Session.get('selectedEventId'), proposals)

      render()
    )

    $('.accept-button').click( (event) ->
      proposalId = new Meteor.Collection.ObjectID($(event.target).parents('.proposal').attr('data-proposal-id'))
      proposalService.update(proposalId, {accepted: true, accepted_by: Meteor.userId(), accepted_date: new Date()})
      render()
    )

    Deps.autorun( () ->
      references = referenceService.read()
      source = ({
        label: "#{ref.creators?[0]?.lastName} #{ref.date} #{ref.title}",
        value: "#{ref.creators?[0]?.lastName} #{ref.date}",
        referenceId: ref._id
      } for ref in references)
      $('.add-proposal-references').autocomplete({
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