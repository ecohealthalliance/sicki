class CollectionService

  constructor: (@name, @collection) ->
    Meteor.subscribe(@name)

  read: (idOrIds, options = {}) ->
    if typeof idOrIds is 'string'
      @collection.findOne({_id: idOrIds}, options)
    else if idOrIds
      @collection.find({_id: {$in: idOrIds}}, options).fetch()
    else
      @collection.find().fetch()

  update: (id, changes) ->
    @collection.update({_id: id}, {$set: changes})

  create: (attributes) ->
    @collection.insert(attributes)


@sicki ?= {}
@sicki.services ?= {}
@sicki.services.CollectionService = CollectionService