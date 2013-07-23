EIDEvents = @sicki.EIDEvents

Meteor.publish('all_eid_events', () ->
  if @userId
    EIDEvents.find()
)
  
EIDEvents.allow({
  'insert': (userId, doc) -> true
  'update': (userId, doc, fieldNames, modified) ->
    console.log("user id #{userId} updated #{doc._id} with #{JSON.stringify(modified)}")
    true
})
