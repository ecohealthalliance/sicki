class CollectionService

  constructor: (@name, @collection) ->
    Meteor.subscribe(@name)

  read: (idOrIds, options = {}) ->
    if typeof idOrIds is 'string'
      @collection.findOne({_id: idOrIds}, options)
    else if _.isArray(idOrIds)
      @collection.find({_id: {$in: idOrIds}}, options).fetch()
    else
      @collection.find().fetch()

  update: (id, changes) ->
    @collection.update({_id: id}, {$set: changes})

  create: (attributes) ->
    @collection.insert(attributes)

  find: (query) ->
    @collection.find(query).fetch()


@sicki ?= {}
@sicki.services ?= {}
@sicki.services.CollectionService = CollectionService