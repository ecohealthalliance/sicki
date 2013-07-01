EIDEvents = new Meteor.Collection('eid')

if Meteor.isClient
  Template.event_list.events = () ->
    EIDEvents.find()
