Session.set('selectedEventId', null)

showTable = () ->
  Session.set('selectedEventId', null)

Meteor.startup () ->
  Template.nav.events(
    'click #nav-list' : (event) -> showTable()
  )