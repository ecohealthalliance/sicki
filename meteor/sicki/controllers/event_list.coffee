EIDEvents = new Meteor.Collection('eid')

if Meteor.isClient
  Template.eventList.eidEvents = () ->
    EIDEvents.find()

  Template.eventList.events(
    'click .eid' : (event) -> console.log('clicked'+event.target.id)
  )