Reference = {
    'uri': 'refs',
    # default type is text
    # required defaults to false, required constraint not used yet
    'fields':[
        {'name':'title'},
        {'name':'creators', 'type':'collection','model'}, # collection???
        {'name':'ISSN'},
        {'name':'DOI'},
        {'name':'itemType'},
        {'name':'extra'},
        {'name':'seriesText'},
        {'name':'series'},
        {'name':'abstractNote'},
        {'name':'archive'},
        {'name':'archiveLocation'},
        {'name':'etag'},
        {'name':'journalAbbreviation'},
        {'name':'issue'},
        {'name':'seriesTitle'},
        {'name':'updated'}, # crappy date -> string
        {'name':'tags'},
        {'name':'accessDate'},
        {'name':'libraryCatalog'},
        {'name':'volume'},
        {'name':'callNumber'},
        {'name':'date'},
        {'name':'pages'},
        {'name':'group_id'},
        {'name':'language'},
        {'name':'shortTitle'},
        {'name':'rights'},
        {'name':'url'},
        {'name':'publicationTitle'}
        ]
}
