#import pymongo
from pyzotero import zotero

library_id = settings['zotero']['library_id']
library_type = settings['zotero']['library_type']
api_key = settings['zotero']['api_key']

'''mongo = pymongo.Connection (settings['mongodb'][['host'], settings['mongodb'][['port'])[settings['mongodb'][['db']]
if settings['mongodb'].get ('username'):
                                                                                            mongo.authenticate(settings['mongodb']['username'], settings['mongodb']['password'])'''

zot = zotero.Zotero(library_id, library_type, api_key)

total = zot.num_items ()

print '%d Records Found' % (total,)

limit = 30
start = 0

count = 0
update = 0
insert = 0

while start < total:
    print 'Processing: %d' % (start,)
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
