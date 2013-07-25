ENTER_KEY_CODE = 13

Meteor.startup () ->
  EIDEvents = @sicki.EIDEvents
  Proposals = @sicki.Proposals
  Pathogens = @sicki.Pathogens

  Meteor.subscribe('all_eid_events')

  Meteor.subscribe('all_proposals')

  Meteor.subscribe('all_pathogens')

  Template.eidEvent.event = () ->
    event = EIDEvents.findOne({_id: Session.get('selectedEventId')})
    eidEvent = {}
    for field, proposals of event
      if field != '_id' and field != 'orig_event' and field != 'jones'
        proposal = Proposals.findOne({_id: {$in: proposals}, accepted: true})
        eidEvent[field] = if proposal then proposal.value else ""
    eidEvent

  handleKeyup = (event) ->
    if event.keyCode is ENTER_KEY_CODE
      id = Session.get('selectedEventId')
      field = $(event.target).parent().attr('field')
      value = $(event.target).val()
      changes = {}
      changes[field] = value
      EIDEvents.update({_id: id}, {$set: changes})

  setupEvents = () ->
    $('.event-property').keyup(handleKeyup)

  @sicki.registerRenderCallback(setupEvents)