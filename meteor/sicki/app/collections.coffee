@sicki ?= {}
@sicki.collections ?= {}

@sicki.collections.Proposals = new Meteor.Collection('proposal')
@sicki.collections.EIDEvents = new Meteor.Collection('eid')
@sicki.collections.Pathogens = new Meteor.Collection('pathogen')
@sicki.collections.References = new Meteor.Collection('reference')