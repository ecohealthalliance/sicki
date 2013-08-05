Meteor.startup () ->
  Template.content.selectedId = () ->
    Session.get('selectedId')

  Template.contentIfLoggedIn.user = () ->
    Meteor.user()

  Template.editPage.eidTable = () ->
    Session.equals('selectedTable', 'eidEvents')

  Template.table.eidTable = () ->
    Session.equals('selectedTable', 'eidEvents')

  Template.editPage.referenceTable = () ->
    Session.equals('selectedTable', 'references')

  Template.table.referenceTable = () ->
    Session.equals('selectedTable', 'references')

  Template.editPage.userTable = () ->
    Session.equals('selectedTable', 'users')

  Template.table.userTable = () ->
    Session.equals('selectedTable', 'users')