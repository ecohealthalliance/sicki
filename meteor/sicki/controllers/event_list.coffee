EIDEvents = new Meteor.Collection('eid')

if Meteor.isServer
  Meteor.publish('all_eid_events', () ->
    if this.userId
      EIDEvents.find()
  )

if Meteor.isClient
  Meteor.subscribe('all_eid_events')

  Template.eventList.eidEvents = () ->
    EIDEvents.find()

  Template.eventList.events(
    'click .eid' : (event) -> console.log('clicked'+event.target.id)
  )