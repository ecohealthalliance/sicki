if Meteor.isClient
  Template.content.showList = () ->
    Session.get('tab') == 'list'
