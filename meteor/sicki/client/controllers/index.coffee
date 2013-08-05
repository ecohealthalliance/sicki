Meteor.startup () ->
  Template.content.selectedId = () ->
    Session.get('selectedId')

  Template.contentIfLoggedIn.user = () ->
    Meteor.user()

  Template.selectedTable.renderSelectedTable = () ->
    switch Session.get('selectedTable')
      when 'eidEvents' then Template.eidTable()
      when 'references' then Template.referenceTable()
      when 'users' then Template.userTable()

  Template.selectedEditPage.renderSelectedEditPage = () ->
    switch Session.get('selectedTable')
      when 'eidEvents' then Template.eidEvent()


