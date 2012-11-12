from gluon.contrib import simplejson as json

from gluon.tools import Crud

import pymongo
from bson.objectid import ObjectId

mongo = pymongo.Connection (settings['mongodb']['host'], settings['mongodb']['port'])[settings['mongodb']['db']]
if settings['mongodb']['username']:
    mongo.authenticate(settings['mongodb']['username'], settings['mongodb']['password'])

db = DAL('sqlite://storage.sqlite')

if settings['database']['type'] == 'sqlite':
    db = DAL('sqlite://storage.sqlite', check_reserved=['all'])
else:
    dd = settings['database']
    db = DAL (dd['type'] + '://' + dd['username'] + ':' + dd['password']  + '@' + dd['host'] + '/' + dd['database'], dd['pool'], check_reserved=['all'])

crud = Crud(globals(), db)
