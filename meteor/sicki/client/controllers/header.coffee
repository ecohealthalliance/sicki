Session.set('selectedId', null)
Session.set('selectedTable', 'eidEvents')

clearState = () ->
  Session.set('selectedId', null)
  Session.set('selectedTable', null)

showTable = () ->
  clearState()
  Session.set('selectedTable', 'eidEvents')
  @sicki.render()

showRefs = () ->
  clearState()
  Session.set('selectedTable', 'references')
  @sicki.render()
    

Meteor.startup () ->
  Meteor.subscribe('userData')

  Template.nav.admin = () ->
    Meteor.user() and Meteor.user().admin

  Template.nav.events(
    'click #nav-events' : (event) -> showTable()
    'click #nav-refs' : (event) -> showRefs()
  )