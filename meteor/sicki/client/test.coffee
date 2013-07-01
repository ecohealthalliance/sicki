#root = global ? window

if Meteor.isClient
  Template.bye.salutations = () ->
    "so long sicki"
  Template.bye.events(
    'click input' : () ->
      console.log 'you clicked the c ya button'
  )