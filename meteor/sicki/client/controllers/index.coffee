Meteor.startup () ->
  Template.content.selectedEventId = () ->
    Session.get('selectedEventId')
