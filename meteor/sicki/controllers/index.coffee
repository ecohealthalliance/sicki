if Meteor.isClient
  Template.content.showList = () ->
    Session.get('tab') == 'list'

  Template.content.showMap = () ->
    Session.get('tab') == 'map'