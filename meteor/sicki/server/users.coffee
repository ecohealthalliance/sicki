Meteor.publish('userData', () ->
  Meteor.users.find({_id: this.userId}, {fields: {admin: true}})
)