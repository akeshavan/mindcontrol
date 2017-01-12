#!/usr/bin/env/python

from pymongo import MongoClient
import argparse

def get_collection(server="localhost", port=3001):

    client = MongoClient(server, port)
    db =  client.meteor
    collection = db.subjects
    return collection, client


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fill mindcontrol \
    database with entries")
    parser.add_argument('-s', '--server', dest="server", default="localhost",
                        help="mongo server")
    parser.add_argument("-p", '--port',   dest="port", default=3001,
                        help="mongo server's port")
    parser.add_argument("-i", '--images', nargs="+", dest="images",
                        help="relative path to images relative to staticURL",
                        required=True)
    parser.add_argument("-n", "--name", dest="name",
                        help="unique name to locate image set",
                        required=True)
    parser.add_argument("-e", "--entry_type", dest="entry_type",
                        help="category of image set. Example: 'freesurfer' ",
                        required=True)
    args = parser.parse_args()
    print(args)
    coll, cli = get_collection(args.server, args.port)
    query = {"entry_type": args.entry_type, "name": args.name}
    entry = {"entry_type": args.entry_type,
             "name": args.name,
             "check_masks": args.images}
    res = coll.find(query)
    if res.count():
        coll.update(query, {"$set": entry})
    else:
        print(coll.insert(entry))
    url = "{}:{}/{}/{}".format(args.server, args.port-1,
                               args.entry_type, args.name)
    print(url)
