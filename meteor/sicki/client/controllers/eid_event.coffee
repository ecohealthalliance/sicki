ENTER_KEY_CODE = 13

Meteor.startup () ->
  EIDEvents = @sicki.EIDEvents
  Pathogens = @sicki.Pathogens

  Meteor.subscribe('all_eid_events')

  Meteor.subscribe('all_pathogens')

  Template.eidEvent.event = () ->
    EIDEvents.findOne({_id: Session.get('selectedEventId')})

  Template.eidEvent.pathogens = () ->
    event = EIDEvents.findOne({_id: Session.get('selectedEventId')})
    Pathogens.find({_id: {$in: event.pathogens}})

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