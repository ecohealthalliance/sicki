Meteor.publish('userData', () ->
  Meteor.users.find({}, {fields: {admin: true, emails: true, profile: true, 'services.google.email': true}})
)

Meteor.users.allow(

  update: (userId, document, fields, changes) ->
    console.log "#{new Date()}: user #{userId} updated #{document._id} with #{JSON.stringify(changes)}"
    Meteor.users.findOne({_id: userId}).admin

)