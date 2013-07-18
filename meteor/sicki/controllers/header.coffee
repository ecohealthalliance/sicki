if Meteor.isClient
  Session.set('tab', 'list')

  showList = () ->
    Session.set('tab', 'list')

  Meteor.startup () ->
    Template.nav.events(
      'click #nav-list' : (event) -> showList()
    )