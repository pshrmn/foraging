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

def underscore_host(host):
    return host.replace(".", "_")

def host_folder(host):
    dir_name = os.path.join(SITE_DIRECTORY, underscore_host(host))
    if not os.path.isdir(dir_name):
        os.mkdir(dir_name)
    return dir_name

@app.route('/upload', methods=['POST'])
def upload():
    """
    save rules json in <sitename>/<groupname>.json
    dangerous because on save, overwrites existing saved site
    manually load request.data in case content-type: application/json isn't set
    """
    try:
        data = json.loads(request.data)
    except ValueError:
        return jsonify({"error": True})
    # change indices from a dict (useful for toggling in collectjs) to an array
    # fails if no index_url is provided
    data["index_urls"] = [key for key in data["index_urls"]]
    hostname = urlparse(data["index_urls"][0]).netloc
    folder = host_folder(hostname)
    filename = "%s.json" % (data["name"])
    path = os.path.join(folder, filename)
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
