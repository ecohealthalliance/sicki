Meteor.startup () ->

  @sicki.render = () ->

    $('#main').html(Meteor.render(Template.content))
    # meteor issue: https://github.com/meteor/meteor/issues/392
    Spark.finalize($('#main')[0])

  