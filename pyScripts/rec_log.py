#!/usr/bin/env python
# Python REST Server Receiver
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from SocketServer import ThreadingMixIn
import threading
import argparse
import re
import cgi
import pymongo
import requests
from pymongo import MongoClient

class LocalData(object):
  records = {}

class HTTPRequestHandler(BaseHTTPRequestHandler):
  def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
            self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type")
  def do_POST(self):
    if None != re.search('/api/getlog/*', self.path):
      ctype, pdict = cgi.parse_header(self.headers.getheader('Content-Type'))
      if ctype == 'application/json':
        length = int(self.headers.getheader('content-length'))
        data = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
        recordID = self.path.split('/')[-2]
        LocalData.records[recordID] = data
        print(data)
        # Insert to mongodb
        connection = MongoClient('127.0.0.1:27017')
    	db = connection.logst
        db.logst.insert_one(data)
        print "record %s is added successfully" % recordID
        print( '\n All data from Logdata Database \n')
    	#for l in log:
    		#print(l)
      else:
        data = {}
      self.send_response(200)
      self.end_headers()
    else:
      self.send_response(403)
      print("bad derp")
      self.send_header('Content-Type', 'application/json')
      self.end_headers()
    return
  def do_GET(self):
    if None != re.search('/api/getlog/*', self.path):
      #recordID = self.path.split('/')[-1]
      # Retrieve from mongodb
      connection = MongoClient('127.0.0.1:27017')
      db = connection.logst
      #data_out=db.logst.aggregate({$group:{_id:"$event",count:{$sum:1}}}})
      if data_out.records.has_key(_id):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        print(data_out)
        #self.wfile.write(LocalData.records[recordID])
      else:
        self.send_response(400, 'Bad Request: record does not exist')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
    else:
      self.send_response(403)
      self.send_header('Content-Type', 'application/json')
      self.end_headers()
    return

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
  allow_reuse_address = True

  def shutdown(self):
    self.socket.close()
    HTTPServer.shutdown(self)

class SimpleHttpServer():
  def __init__(self, ip, port):
    self.server = ThreadedHTTPServer((ip,port), HTTPRequestHandler)

  def start(self):
    self.server_thread = threading.Thread(target=self.server.serve_forever)
    self.server_thread.daemon = True
    self.server_thread.start()

  def waitForThread(self):
    self.server_thread.join()

  def addRecord(self, recordID, jsonEncodedRecord):
    LocalData.records[recordID] = jsonEncodedRecord

  def stop(self):
    self.server.shutdown()
    self.waitForThread()

if __name__=='__main__':
  parser = argparse.ArgumentParser(description='HTTP Server')
  parser.add_argument('port', type=int, help='Listening port for HTTP Server')
  parser.add_argument('ip', help='HTTP Server IP')
  args = parser.parse_args()

  server = SimpleHttpServer(args.ip, args.port)
  print 'Server Running......'
  server.start()
  server.waitForThread()
