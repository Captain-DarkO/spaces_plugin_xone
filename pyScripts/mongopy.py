import pymongo
import requests
from pymongo import MongoClient

# parse the receivedjson object
#url="http://127.0.0.1"
while True:
	r=requests.get(page)
	print(r.json);
	#jsonData =json.loads(d)
	connection = MongoClient('127.0.0.1:27017')
	db = connection.logst
	#db.logst.insert_one( { "Event":"BTN2", "Time" : "15022" });
	db.logst.insert_one( {r.json);
	log = db.logst.find()
	print( '\n All data from Logdata Database \n')
	for l in log:
		print(l)
	print(db.logt.find({"event":"BTN1"}).count())
