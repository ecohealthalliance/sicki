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