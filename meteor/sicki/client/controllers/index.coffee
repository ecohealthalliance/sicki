Meteor.startup () ->
  Template.content.selectedEventId = () ->
    Session.get('selectedEventId')

  Template.contentIfLoggedIn.user = () ->
    Meteor.user()

