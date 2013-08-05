Meteor.startup () ->
  FIELDS = @sicki.constants.USER_FIELDS
  render = @sicki.render


  Template.userTable.fields = () ->
    ({name: name, label: FIELDS[name].label} for name in _.keys(FIELDS))

  Template.userTable.users = () ->
    users = Meteor.users.find().fetch()

    userList = []
    for user in users
      userData = {_id: user._id, userFields: []}
      for field in _.keys(FIELDS)
        if field is 'email'
          user.email = user.services?.google?.email or user.emails?[0]?.address
        if field is 'name'
          user.name = user.profile?.name
        if field is 'admin'
          user.admin ?= false
        canChangeAdmin = (field is 'admin' and Meteor.user().admin)

        userData.userFields.push({field: field, value: user[field], canChangeAdmin: canChangeAdmin})
      userList.push(userData)
    userList

  loadDataTable = () ->
    setupEvents = () ->
      $('.change-admin').click( (event) ->
        id = $(this).parents('tr').attr('id')
        isAdmin = Meteor.users.findOne({_id: id}).admin
        Meteor.users.update(id, {$set: {admin: !isAdmin}})
        render()
      )

    if $('#userTable').length
      table = $('#userTable').dataTable
        "sDom": "<'table-controls'<'table-control-row'<'span6'l><'filter-control'f>><'table-control-row'<'column-control'C>>r>t<'row-fluid'<'span6'i><'span6'p>>"
        "sPaginationType": "full_numbers"
        "oLanguage":
          "sLengthMenu": "_MENU_ records per page"
        "fnDrawCallback": setupEvents
        "bAutoWidth": false

      $('.user-table-container').show()
      $('.loading-message').hide()

  @sicki.registerRenderCallback(loadDataTable)

