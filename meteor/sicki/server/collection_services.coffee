setup = (collectionName, collection) ->

  Meteor.publish(collectionName, () ->
    if @userId
      collection.find()
  )

  collection.allow(

    insert: (userId, document) ->
      console.log "#{new Date()}: user #{userId} inserted #{JSON.stringify(document)}"
      true

    update: (userId, document, fields, changes) ->
      console.log "#{new Date()}: user #{userId} updated #{document._id} with #{JSON.stringify(changes)}"
      true

  )

setup(name, collection) for name, collection of @sicki.collections