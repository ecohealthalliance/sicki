ENTER_KEY_CODE = 13

FIELDS =
  event_name: 
    label: 'Event Name'
  pathogen: 
    label: 'Pathogen'
  location:
    label: 'Location'
  host:
    label: 'Host'
  disease: 
    label: 'Disease'
  start_date:
    label: 'Start Date'
  end_date:
    label: 'End Date'
  host_age:
    label: 'Host Age'
  host_use:
    label: 'Host Use'
  transition_model:
    label: 'Transition Model'
  zoonotic_type:
    label: 'Zoonotic Type'
  number_infected:
    label: 'Number Infected'
  prevalence:
    label: 'Prevalence'
  duration:
    label: 'Duration'
  symptoms_reported:
    label: 'Symptoms Reported'
  host_sex:
    label: 'Host Sex'
  sample_type:
    label: 'Sample Type'
  driver:
    label: 'Driver'
  domestication_status:
    label: 'Domestication Status'
  number_deaths:
    label: 'Number Deaths'
  contact:
    label: 'Contact'
  notes:
    label: 'Notes'

Meteor.startup () ->
  EIDEvents = @sicki.EIDEvents
  Proposals = @sicki.Proposals
  Pathogens = @sicki.Pathogens
  References = @sicki.References
  render = @sicki.render

  Meteor.subscribe('all_eid_events')

  Meteor.subscribe('all_proposals')

  Meteor.subscribe('all_pathogens')

  Meteor.subscribe('all_references')

  Meteor.subscribe('userData')

  Template.eidEvent.fields = () ->
    event = EIDEvents.findOne({_id: Session.get('selectedEventId')})
    eidEventFields = []
    for field in _.keys(FIELDS)
      eventField =
        name: field
        label: FIELDS[field].label
      if event[field]
        proposalIds = event[field]
        proposals = Proposals.find({_id: {$in: proposalIds}}, {sort: {accepted: -1}}).fetch()
        for proposal in proposals
          if proposal.source != 'original_data'
            user = Meteor.users.findOne({_id: proposal.source})
            userEmail = user.emails[0].address
            proposal.userEmail = userEmail
          proposal.canAccept = Meteor.user()?.admin and !proposal.accepted
          proposal.proposalId = proposal._id.toHexString()
        eventField.proposals = if proposals then proposals else []
      eidEventFields.push(eventField)
    eidEventFields

  setupEvents = () ->
    $('.add-proposal-button').click( (event) ->
      fieldName = $(event.target).parents('.event-field').attr('data-field-name')
      value = $(event.target).siblings('.add-proposal-value').val()

      referenceIdList = $(event.target).siblings('.reference-list').attr('data-reference-ids')
      refIds = referenceIdList.split(',')

      id = Proposals.insert({value: value, date: new Date(), source: Meteor.userId(), references: refIds})

      event = EIDEvents.findOne({_id: Session.get('selectedEventId')})
      proposals = {}
      proposals[fieldName] = event[fieldName]
      proposals[fieldName].push(id)
      EIDEvents.update({_id: Session.get('selectedEventId')}, {$set: proposals})

      render()
    )

    $('.accept-button').click( (event) ->
      proposalId = new Meteor.Collection.ObjectID($(event.target).parents('.proposal').attr('data-proposal-id'))
      Proposals.update({_id: proposalId}, {$set: {accepted: true, accepted_by: Meteor.userId()}})
      render()
    )

    Deps.autorun( () ->
      references = References.find().fetch()
      source = ({
        label: "#{ref.creators?[0]?.lastName} #{ref.date} #{ref.title}",
        value: "#{ref.creators?[0]?.lastName} #{ref.date}",
        referenceId: ref._id
      } for ref in references)
      $('.add-proposal-references').autocomplete({
        source: source,
        select: (event, ui) ->
          refList = $(event.target).siblings('.reference-list')
          refList.append(" #{ui.item.value} ")
          oldIdList = refList.attr('data-reference-ids')
          newIdList = if oldIdList then "#{oldIdList},#{ui.item.referenceId}" else "#{ui.item.referenceId}"
          refList.attr('data-reference-ids', newIdList)
          false
      })
    )

  @sicki.registerRenderCallback(setupEvents)