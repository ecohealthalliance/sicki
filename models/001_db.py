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

db = DAL('sqlite://storage.sqlite')

if settings['database']['type'] == 'sqlite':
    db = DAL('sqlite://storage.sqlite', check_reserved=['all'])
else:
    dd = settings['database']
    db = DAL (dd['type'] + '://' + dd['username'] + ':' + dd['password']  + '@' + dd['host'] + '/' + dd['database'], dd['pool'], check_reserved=['all'])

crud = Crud(globals(), db)


class MongoCursorWrapper:
    def __init__ (self, cursor):
        self.__cursor = cursor

    def __getattr__ (self, key):
        return getattr (self.__cursor, key)

    def __getitem__ (self, index):
        return MongoWrapper (self.__cursor[index])
        #return map (lambda x : MongoWrapper (x), self.__cursor[index])

    def __len__ (self):
        return self.__cursor.count ()
    
    def __iter__ (self):
        return MongoWrapperIter (self.__cursor)

class MongoWrapper:
    def __init__ (self, cursor):
        self.__dict__['cursor'] = cursor

    def __getattr__ (self, key):
        try:
            return getattr (self.cursor, key)
        except AttributeError:
            try:
                val = self.cursor[unicode (key)]
                if (type (val) == list) or (type (val) == dict):
                    return MongoWrapper (self.cursor[unicode (key)])
                else:
                    return val
            except KeyError:
                return None

    def __nonzero__ (self):
        if self.cursor is None:
            return False
        return len (self.cursor) != 0

    def __iter__ (self):
        return MongoWrapperIter (self.cursor)

    '''def __setattrbute__ (self, key, value):
        try:
            setattr (self.cursor, key)
        except AttributeError:
            self.cursor[unicode (key)]'''

class MongoWrapperIter:
    def __init__ (self, cursor):
        self.__cursor = iter (cursor)

    def __iter__ (self):
        return self

    def next (self):
        val = self.__cursor.next ()
        if (type (val) == list) or (type (val) == dict):
            return MongoWrapper (val)
        else:
            return val

class attr_dict (dict):
    def __init__ (self, **attr):
        dict.__init__ (self, **attr)

    def __getattr__ (self, key):
        try:
            return self[key]
        except KeyError:
            return None

    def default (self, key, default):
        if self.has_key (key):
            return
        else:
            self[key] = default

    def json (self):
        return json.dumps (self)
