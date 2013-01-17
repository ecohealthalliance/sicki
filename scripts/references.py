import pymongo
from pyzotero import zotero
from importlib import import_module

mod = import_module ('models.000_config')

library_id = settings['zotero']['library_id']
library_type = settings['zotero']['library_type']
api_key = settings['zotero']['api_key']

exit (0)

mongo = pymongo.Connection ('localhost', 27017)['sicki']

zot = zotero.Zotero(library_id, library_type, api_key)

total = zot.num_items ()

print total

limit = 30
start = 0

count = 0
update = 0
insert = 0

while start < total:
    print '%d' % (start,)
    items = zot.top (start = start, limit = limit)
    for item in items:
        # Strangeness if start and limit exceeed total number of items. Don't read more than the total number of items
        if count >= total:
            break
        count += 1
        if not mongo.refs.find ({'key': item['key']}).count ():
            insert += 1
            mongo.refs.insert (item)
        else:
            update += 1
            mongo.refs.update ({
                    'key': item['key']
                    }, {
                    '$set': item
                    })
    start += limit

print "%d Records Found: %d Inserted, %d Updated" % (count, insert, update)
