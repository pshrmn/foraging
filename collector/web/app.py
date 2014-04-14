from flask import Flask, request, jsonify
import json
import os
import argparse
from urlparse import urlparse

DIRECTORY = os.path.dirname(os.path.realpath(__file__))
SITE_DIRECTORY = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'rules')

if not os.path.exists(SITE_DIRECTORY):
    os.mkdir(SITE_DIRECTORY)

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload():
    """
    save rules json in <sitename>.json
    dangerous because on save, overwrites existing saved site
    """
    data = request.json
    filename = "%s.json" % (data["site"].replace('.','-'))
    path = os.path.join(SITE_DIRECTORY, filename)
    with open(path, 'w') as fp:
        json.dump(data, fp, indent=2)
    return jsonify({"error": False})

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Server to run with collect-chrome')
    parser.add_argument('--folder', '-F', dest='directory',
                   help='folder to save groups to')
    args = parser.parse_args()    
    SITE_DIRECTORY = args.directory or SITE_DIRECTORY
    app.run(debug=True)
