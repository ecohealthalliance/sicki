Meteor.startup () ->
  @sicki.constants ?= {}

  @sicki.constants.USER_FIELDS =
    name:
      label: 'Name'
    email:
      label: 'Email'
    admin:
      label: 'Admin'

