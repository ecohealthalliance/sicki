from gluon.contrib import simplejson as json

from gluon.tools import Crud

import pymongo
from bson.objectid import ObjectId

import re

try:
    mongo = pymongo.Connection (settings['mongodb']['host'], settings['mongodb']['port'])[settings['mongodb']['db']]
except:
    raise HTTP (400, 'Could not connect to MongoDB')
if settings['mongodb']['username']:
    mongo.authenticate(settings['mongodb']['username'], settings['mongodb']['password'])

# legacy web2py DAL stuff, only used for auth
db = DAL('sqlite://storage.sqlite')

if settings['database']['type'] == 'sqlite':
    db = DAL('sqlite://storage.sqlite', check_reserved=['all'])
else:
    dd = settings['database']
    db = DAL (dd['type'] + '://' + dd['username'] + ':' + dd['password']  + '@' + dd['host'] + '/' + dd['database'], dd['pool'], check_reserved=['all'])


# Generic MongoDB CRUD class for enforcing schemas. Requires that a variable mongo
# exists, which is a connection to a mongo instance
class CRUD:
    mongo = mongo
    def __init__(self, model):
        self.model = model
        self.collection = self.mongo[model['name']]

    def create(self):
        from uuid import uuid4
        id = uuid4().hex
        return self.collection.insert({
                '_id': id
                });
        
    def read(self, id):
        db_result = self.collection.find_one({
                '_id': id
                })
        if not db_result:
            raise Exception('Item Not Found ' + self.model['name'])
        return self._parse_record(db_result)

    def read_all(self, fields = None, sort = None):
        if fields:
            fields.append('_id')
            if sort:
                fields.append(sort)

        db_results = self.collection.find({}, fields)
        results = []
        for db_result in db_results:
            results.append(self._parse_record(db_result))
        return results

    def _parse_record(self, db_result):
        result = {
            'id': db_result['_id']
            }

        for field in self.model['fields']:
            field_key = field['name']
            field_type = field.get('type') or 'text'
            if db_result.has_key(field_key):
                if field_type == 'collection':
                    print str(field)
                    foreign_crud = CRUD(field['model'])
                    joined_items = []
                    for foreign_key in db_result[field_key]:
                        joined_items.append(foreign_crud.read(foreign_key))
                    result[field_key] = joined_items
                elif field_type == 'model':
                    foreign_crud = CRUD(field['model'])
                    result[field_key] = foreign_crud(db_result[field_key])
                else:
                    result[field_key] = db_result[field_key]
        return result

    def update(self, id, kwargs):
        for key, value in kwargs.iteritems():
            self.collection.update({
                    '_id': id
                    }, {
                    '$set': {key: value}
                    })
    
    def delete(self, id):
        pass
    
