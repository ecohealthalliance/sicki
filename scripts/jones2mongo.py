import sys, csv, pymongo, json
from pprint import pprint

# give filename (eg ~/Dropbox/sicki/match-key.csv) on cmd line
file = sys.argv[1]

#from pymongo import MongoClient
#connection = MongoClient()
#db = connection.sicki
db = pymongo.Connection ('localhost', 27017)['sicki']
events = db.events

# 'r' is for read mode
with open(file,'r') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        try:
            eid_id = int(row['EID_ID'])
        except ValueError:
            continue
        row['Sources'] = json.loads(row['Sources'])
        print events.find_one({'eid_id':eid_id})
        events.update({'eid_id':eid_id},{ '$set' : {'jones':row} })

        
