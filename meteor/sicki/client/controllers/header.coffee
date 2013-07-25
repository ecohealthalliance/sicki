Session.set('selectedEventId', null)

showTable = () ->
  if Session.get('selectedEventId') != null
    Session.set('selectedEventId', null)
    @sicki.render()

Meteor.startup () ->
  Meteor.subscribe('userData')

  Template.nav.admin = () ->
    Meteor.user() and Meteor.user().admin

  Template.nav.events(
    'click #nav-list' : (event) -> showTable()
  )