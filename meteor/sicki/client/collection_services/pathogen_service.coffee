Meteor.startup () ->
  Pathogens = @sicki.collections.Pathogens

  class PathogenService extends @sicki.services.CollectionService

    constructor: () ->
      super 'Pathogens', Pathogens


  @sicki.services.pathogenService = new PathogenService()