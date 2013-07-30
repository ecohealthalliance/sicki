@sicki = {}

@sicki.Proposals = new Meteor.Collection('proposal', {idGeneration: 'MONGO'})
@sicki.EIDEvents = new Meteor.Collection('eid')
@sicki.Pathogens = new Meteor.Collection('pathogen')
@sicki.References = new Meteor.Collection('reference')