from flask import Flask, request, jsonify
import json
import os
import argparse
from urlparse import urlparse

app = Flask(__name__)

def set_directory(name):
    global SITE_DIRECTORY
    SITE_DIRECTORY = name
    if not os.path.exists(SITE_DIRECTORY):
        os.mkdir(SITE_DIRECTORY)

def underscore_host(host):
    """
    replace periods in a url with underscores for valid folder name
    """
    return host.replace(".", "_")

def host_folder(host):
    """
    determine directory name based on hostname
    create directory if it doesn't already exist
    """
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

    site = data["site"]
    name = data["group"]["name"]
    folder = host_folder(site)

    filename = "%s.json" % (name)
    path = os.path.join(folder, filename)
    with open(path, 'w') as fp:
        json.dump(data["group"], fp, indent=2)
    return jsonify({"error": False})

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Server to run with collectorjs')
    parser.add_argument('--folder', '-F', dest='directory',
                   help='folder to save groups to')
    args = parser.parse_args()    

    directory = args.directory or os.path.join(os.path.dirname(os.path.realpath(__file__)), 'rules')
    set_directory(directory)
    app.run(debug=True)
else:
    set_directory(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'rules'))