Session.set('selectedEventId', null)

showTable = () ->
  Session.set('selectedEventId', null)
  @sicki.render()

Meteor.startup () ->
  Template.nav.events(
    'click #nav-list' : (event) -> showTable()
  )