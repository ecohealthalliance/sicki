EIDEvents = new Meteor.Collection('eid')

if Meteor.isServer
  Meteor.publish('all_eid_events', () ->
    if this.userId
      EIDEvents.find()
  )
  EIDEvents.allow({
    # user and doc checks return true to allow insert
    'insert': (userId,doc) -> true
    'update': (userId, doc, fieldNames, modifier) -> true
  });



setVal = (val,eventId,field) ->
  # this is not actually working yet ??? silently fails
  #console.log('setting '+val+eventId+field)
  EIDEvents.update({_id: eventId},{ $set: {field: val} } )

if Meteor.isClient
  Meteor.subscribe('all_eid_events')

  Template.eventList.eidEvents = () ->
    EIDEvents.find()

  Template.eventList.events(
    'click .eid' : (event) -> console.log('clicked'+event.target.id)
  )

  # wait til eidTable template loads
  Meteor.startup () ->
    Template.eidTable.eidEvents = () ->
      EIDEvents.find()

    rend = () ->
      $('#main').html(Meteor.render(Template.content))
      # meteor issue: https://github.com/meteor/meteor/issues/392
      Spark.finalize($('#main')[0])
      $('#eidTable').dataTable
        "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>"
        "sPaginationType": "bootstrap"
        "oLanguage":
          "sLengthMenu": "_MENU_ records per page"

      setter = (value,settings) ->
        setVal(value,settings.id,settings.name)
        value

      $('td').each( () ->
        id = $(this).parent().attr('id')
        col = $(this).attr('col')
        $(this).editable(setter , {id: id, name: col} )
        )

    # refactor! need to wait for eidEvents to come back
    setTimeout(rend, 150)


