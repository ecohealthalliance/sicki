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

  Template.selectedDetailsPage.renderSelectedDetailsPage = () ->
    switch Session.get('selectedTable')
      when 'eidEvents' then Template.eidDetails()


  initialRender = _.once @sicki.render

  Deps.autorun () =>
    allDataLoaded = _.all @sicki.services, (service) ->
      if service.ready then service.ready() else true

    if allDataLoaded
      initialRender()
    

