from flask import Flask, request, jsonify
import json
import os
import argparse

directory = os.path.dirname(os.path.realpath(__file__))
rules_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'rules')

if not os.path.exists(rules_directory):
    os.mkdir(rules_directory)

app = Flask(__name__)

# open up the groups.json file and save the contents to the attributes list
with open('%s/groups.json' % directory) as fp:
    groups = json.load(fp)

@app.route('/upload', methods=['POST'])
def upload():
    data = request.json
    host = data['host']
    group_name = data['name']

    # underscores instead of periods for python imports
    host_underscore = host.replace('.','_')
    host_dir = '%s/%s' % (rules_directory, host_underscore)
    if not os.path.isdir(host_dir):
        os.mkdir(host_dir)
    filename = '%s/rules.json' % host_dir
    open_type = 'w' if not os.path.isfile(filename) else 'r+'
    with open(filename, open_type) as fp:
        curr_json = {} if open_type == 'w' else json.load(fp)
        curr_json[group_name] = data['rules']
        fp.seek(0)
        json.dump(curr_json, fp, indent=2)
    return jsonify({"error": False})

@app.route('/groups', methods=['GET'])
def send_groups():
    return jsonify(groups)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Server to run with collect-chrome')
    parser.add_argument('--folder', '-F', dest='directory',
                   help='folder to save groups to')
    args = parser.parse_args()    
    rules_directory = args.directory or rules_directory
    app.run(debug=True)
