if Meteor.isClient
  Session.set('tab', 'list')

  showMap = () ->
    Session.set('tab', 'map')

  showList = () ->
    Session.set('tab', 'list')

  Template.nav.events(
    'click #nav-map' : (event) -> showMap()
    'click #nav-list' : (event) -> showList()
  )