Meteor.startup () ->
  @sicki.EID_EVENT_FIELDS = 
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

