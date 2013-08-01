ENTER_KEY_CODE = 13

FIELDS =
Meteor.startup () ->
  FIELDS = @sicki.EID_EVENT_FIELDS
  EIDEvents = @sicki.EIDEvents
  Proposals = @sicki.Proposals
  Pathogens = @sicki.Pathogens
  References = @sicki.References
  render = @sicki.render

  Meteor.subscribe('all_eid_events')

  Meteor.subscribe('all_proposals')

  Meteor.subscribe('all_pathogens')

  Meteor.subscribe('all_references')

  Meteor.subscribe('userData')

  Template.eidEvent.fields = () ->
    event = EIDEvents.findOne({_id: Session.get('selectedEventId')})
    eidEventFields = []
    for field in _.keys(FIELDS)
      eventField =
        name: field
        label: FIELDS[field].label
        isPathogen: (field is 'pathogen')
      if event[field]
        proposalIds = event[field]
        proposals = Proposals.find({_id: {$in: proposalIds}}, {sort: {accepted: -1}}).fetch()
        for proposal in proposals
          if proposal.source != 'original_data'
            user = Meteor.users.findOne({_id: proposal.source})
            proposal.userDisplayName = user.profile?.name or user.emails?[0]?.address
          proposal.canAccept = Meteor.user()?.admin and !proposal.accepted
          proposal.proposalId = proposal._id.toHexString()

          refs = (References.findOne({_id: refId}) for refId in (proposal.references or []))
          proposal.refList = ("#{ref.date} #{ref.creators?[0]?.lastName}" for ref in refs).join(',')

          if field is 'pathogen'
            proposal.pathogen = Pathogens.findOne({_id: proposal.value})
        eventField.proposals = if proposals then proposals else []

      eidEventFields.push(eventField)

    eidEventFields

  setupEvents = () ->
    $('.add-proposal-button').click( (event) ->
      fieldName = $(event.target).parents('.event-field').attr('data-field-name')

      if fieldName is 'pathogen'
        value = $(event.target).siblings('.add-pathogen-value').attr('data-pathogen-id')
      else
        value = $(event.target).siblings('.add-proposal-value').val()

      referenceIdList = $(event.target).siblings('.reference-list').attr('data-reference-ids')
      refIds = (id for id in referenceIdList.split(',') when id)

      id = Proposals.insert({value: value, date: new Date(), source: Meteor.userId(), references: refIds})

      event = EIDEvents.findOne({_id: Session.get('selectedEventId')})
      proposals = {}
      proposals[fieldName] = event[fieldName] or []
      proposals[fieldName].push(id)
      EIDEvents.update({_id: Session.get('selectedEventId')}, {$set: proposals})

      render()
    )

    $('.accept-button').click( (event) ->
      proposalId = new Meteor.Collection.ObjectID($(event.target).parents('.proposal').attr('data-proposal-id'))
      Proposals.update({_id: proposalId}, {$set: {accepted: true, accepted_by: Meteor.userId(), accepted_date: new Date()}})
      render()
    )

    Deps.autorun( () ->
      references = References.find().fetch()
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

      pathogens = Pathogens.find().fetch()
      source = ({
        label: pathogen.reported_name,
        pathogenId: pathogen._id
      } for pathogen in pathogens)
      $('.add-pathogen-value').autocomplete({
        source: source,
        select: (event, ui) ->
          $(event.target).attr('data-pathogen-id', ui.item.pathogenId)
      })
    )

  @sicki.registerRenderCallback(setupEvents)