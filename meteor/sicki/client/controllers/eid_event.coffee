ENTER_KEY_CODE = 13

FIELDS =
  event_name: 
    label: 'Event Name'
  pathogen: 
    label: 'Pathogen'
  location:
    label: 'Location'
  disease: 
    label: 'Disease'

Meteor.startup () ->
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
      if event[field]
        proposalIds = event[field]
        eventField =
          name: field
          label: FIELDS[field].label
        proposals = Proposals.find({_id: {$in: proposalIds}}, {sort: {accepted: -1}}).fetch()
        for proposal in proposals
          if proposal.source != 'original_data'
            user = Meteor.users.findOne({_id: proposal.source})
            userEmail = user.emails[0].address
            proposal.userEmail = userEmail
          proposal.canAccept = Meteor.user()?.admin and !proposal.accepted
        eventField.proposals = if proposals then proposals else []
        eidEventFields.push(eventField)
    eidEventFields

  setupEvents = () ->
    $('.add-proposal-button').click( (event) ->
      fieldName = $(event.target).parents('.event-field').attr('data-field-name')
      value = $(event.target).siblings('.add-proposal-value').val()
      id = Proposals.insert({value: value, date: new Date(), source: Meteor.userId()})

      event = EIDEvents.findOne({_id: Session.get('selectedEventId')})
      proposals = {}
      proposals[fieldName] = event[fieldName]
      proposals[fieldName].push(id)
      EIDEvents.update({_id: Session.get('selectedEventId')}, {$set: proposals})

      render()
    )

    Deps.autorun( () ->
      references = References.find().fetch()
      titles = (ref.title for ref in references)
      $('.add-proposal-references').autocomplete({source: titles})
    )

  @sicki.registerRenderCallback(setupEvents)