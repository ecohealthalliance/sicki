Meteor.startup () ->
  EIDEvents = @sicki.collections.EIDEvents

  class EIDEventService extends @sicki.services.CollectionService

    constructor: () ->
      super 'EIDEvents', EIDEvents


  @sicki.services.eidEventService = new EIDEventService()