class EID
  getAllEids: ->
    # return promise??
    #ret = null
    $.ajax
      url: '../../../eid/events'
      async: true # for now
      dataType: 'json'
      #success: (d) -> ret = d
    #ret

  makeCol: (id,name,width=100) ->
    if !name
      name = id.substring(0,1).toUpperCase() + id.substring(1,id.length)
      name = name.replace(/_/g, ' ');
    id: id
    name: name
    field: id
    width: width
    editor: Slick.Editors.Text

  # this really needs to come from backend/data
  getColumns: ->
    colIds = ['event_name','disease','host','location','eid_id','start_date']
    cols = (@makeCol(id) for id in colIds)
    

window.eid = new EID