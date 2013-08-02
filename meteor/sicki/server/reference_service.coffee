References = @sicki.collections.References

Meteor.publish('all_references', () ->
  if @userId
    References.find()
)