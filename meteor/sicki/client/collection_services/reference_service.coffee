Meteor.startup () ->
  References = @sicki.collections.References

  class ReferenceService extends @sicki.services.CollectionService

    constructor: () ->
      super 'References', References


  @sicki.services.referenceService = new ReferenceService()