class CollectionService

  constructor: (@name, @collection) ->
    Meteor.subscribe(@name)

  all: () ->
    @collection.find().fetch()

  get: (id) ->
    @collection.findOne({_id: id})

  set: (id, changes) ->
    @collection.update({_id: id}, {$set: changes})


@sicki ?= {}
@sicki.services ?= {}
@sicki.services.CollectionService = CollectionService