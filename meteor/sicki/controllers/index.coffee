if Meteor.isClient

  Meteor.startup () ->
    Template.content.showList = () ->
      Session.get('tab') == 'list'
