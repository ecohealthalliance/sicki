Meteor.startup () ->
  @sicki.constants ?= {}

  @sicki.constants.REFERENCE_FIELDS =
    date:
      label: 'Date'
    creators:
      label: 'Creators'
    title:
      label: 'Title'
    itemType:
      label: 'Type'
    publicationTitle:
      label: 'Publication Title'