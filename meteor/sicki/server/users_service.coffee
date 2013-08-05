Meteor.publish('userData', () ->
  Meteor.users.find({}, {fields: {admin: true, emails: true, profile: true, 'services.google.email': true}})
)