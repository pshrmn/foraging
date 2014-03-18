from flask import Flask, request, jsonify
import json
import os
import argparse
from urlparse import urlparse

DIRECTORY = os.path.dirname(os.path.realpath(__file__))
RULES_DIRECTORY = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'rules')

if not os.path.exists(RULES_DIRECTORY):
    os.mkdir(RULES_DIRECTORY)

app = Flask(__name__)

# open up the groups.json file and save the contents to the attributes list
with open(os.path.join(DIRECTORY, 'groups.json')) as fp:
    groups = json.load(fp)

def site_folder(domain):
    """
    given a domain, create a folder for it if it doesn't exist, and return path to folder
    """
    folder = os.path.join(RULES_DIRECTORY, domain.replace('.','_'))
    if not os.path.isdir(folder):
        # make the folder with necessary files
        os.mkdir(folder)
        with open(os.path.join(folder, 'rules.json'), 'w') as fp:
            fp.write("{}")
        open(os.path.join(folder, 'index.txt'), 'w').close()
    return folder

@app.route('/upload', methods=['POST'])
def upload():
    data = request.json
    host = data['host']
    group_name = data['name']

    folder = site_folder(host)
    filename = os.path.join(folder, 'rules.json')
    with open(filename, 'r+') as fp:
        try:
            curr_json = json.load(fp)
        except ValueError:
            curr_json = {}
        curr_json[group_name] = data['rules']
        fp.seek(0)
        json.dump(curr_json, fp, indent=2)
        fp.truncate()
    return jsonify({"error": False})

@app.route('/addindex', methods=['GET'])
def add_index():
    name = request.values["name"]
    url = urlparse(name)
    domain = url.hostname
    folder = site_folder(domain)
    filename = os.path.join(folder, 'index.txt')
    with open(filename, 'r+') as fp:
        lines = []
        lines = fp.read().splitlines()
        if name not in lines:
            lines.append(name)
            fp.seek(0)
            fp.write("\n".join(lines))
            fp.truncate()
    return jsonify({"error": False})

@app.route('/removeindex', methods=['GET'])
def remove_index():
    name = request.values["name"]
    url = urlparse(name)
    domain = url.hostname
    folder = site_folder(domain)
    filename = os.path.join(folder, 'index.txt')
    with open(filename, 'r+') as fp:
        lines = fp.read().splitlines()
        try:
            index = lines.index(name)
            lines.pop(index)
            fp.seek(0)
            fp.write("\n".join(lines))
            fp.truncate()
        except ValueError:
            pass            
    return jsonify({"error": False})


@app.route('/groups', methods=['GET'])
def send_groups():
    return jsonify(groups)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Server to run with collect-chrome')
    parser.add_argument('--folder', '-F', dest='directory',
                   help='folder to save groups to')
    args = parser.parse_args()    
    RULES_DIRECTORY = args.directory or RULES_DIRECTORY
    app.run(debug=True)
