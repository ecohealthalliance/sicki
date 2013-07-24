Pathogens = @sicki.Pathogens

Meteor.publish('all_pathogens', () ->
  if @userId
    Pathogens.find()
)

Pathogens.allow({
  'insert': (userId, doc) ->
    console.log("user id #{userId} inserted #{JSON.stringify(doc)}")
    true
  'update': (userId, doc, fieldNames, modified) ->
    console.log("user id #{userId} updated #{doc._id} with #{JSON.stringify(modified)}")
    true
})