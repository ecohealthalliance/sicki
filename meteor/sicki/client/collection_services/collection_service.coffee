class CollectionService

  constructor: (@name, @collection) ->
    Meteor.subscribe(@name)

  all: () ->
    @collection.find().fetch()

  get: (idOrIds, options = {}) ->
    if typeof idOrIds is 'string'
      @collection.findOne({_id: idOrIds}, options)
    else
      @collection.find({_id: {$in: idOrIds}}, options).fetch()

  set: (id, changes) ->
    @collection.update({_id: id}, {$set: changes})

  create: (attributes) ->
    @collection.insert(attributes)


@sicki ?= {}
@sicki.services ?= {}
@sicki.services.CollectionService = CollectionService