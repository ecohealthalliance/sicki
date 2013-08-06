Meteor.startup () ->
  FIELDS = @sicki.constants.USER_FIELDS
  TableController = @sicki.controllers.TableController


  Template.userTable.fields = () ->
    ({name: name, label: FIELDS[name].label} for name in _.keys(FIELDS))

  Template.userTable.rows = () ->
    ({
      _id: user._id
      data: ({field: field, value: user} for field in _.keys(FIELDS))
    } for user in Meteor.users.find().fetch())

  Template.userTable.renderField = (field, value) ->
    switch field
      when 'email' then value?.services?.google?.email or value?.emails?[0]?.address
      when 'name' then value?.profile?.name
      when 'admin'
        Template.userTableAdminField({
          value: value?.admin or false
          canChange: Meteor.user().admin
        })
      else value

  setupEvents = () ->
    $('.change-admin').click( (event) ->
      id = $(this).parents('tr').attr('id')
      isAdmin = Meteor.users.findOne({_id: id}).admin
      Meteor.users.update(id, {$set: {admin: !isAdmin}})
      render()
    )

  controller = new TableController(Template.userTable, setupEvents)
  controller.start()


