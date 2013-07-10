EIDEvents = new Meteor.Collection('eid')

if Meteor.isServer
  Meteor.publish('all_eid_events', () ->
    if this.userId
      EIDEvents.find()
  )

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
      $('#eidTable').dataTable
        "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>"
        "sPaginationType": "bootstrap"
        "oLanguage":
          "sLengthMenu": "_MENU_ records per page"

    # refactor! need to wait for eidEvents to come back
    setTimeout(rend, 150)


