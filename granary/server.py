import json
import os
import argparse
import glob

from flask import Flask, request, jsonify

app = Flask(__name__)
SITE_DIRECTORY = ""


def set_directory(name):
    global SITE_DIRECTORY
    SITE_DIRECTORY = name
    os.makedirs(SITE_DIRECTORY, exist_ok=True)


def underscore_host(host):
    """
    replace periods in a url with underscores for valid folder name
    """
    return host.replace(".", "_")


def host_folder(host, create=True):
    """
    determine directory name based on hostname
    create directory if it doesn't already exist
    """
    dir_name = os.path.join(SITE_DIRECTORY, underscore_host(host))
    if create:
        os.makedirs(dir_name, exist_ok=True)
    return dir_name


@app.route('/upload', methods=['POST'])
def upload():
    """
    save rules json in <sitename>/<page_name>.json
    DANGER: overwrites existing saved page
    """
    name = request.form.get("name")
    site = request.form.get("site")
    page = request.form.get("page")
    if name is None or site is None or page is None:
        return jsonify({"error": True})

    folder = host_folder(site)

    filename = "%s.json" % (name)
    path = os.path.join(folder, filename)
    with open(path, 'wb') as fp:
        fp.write(page.encode("utf-8"))
    return jsonify({"error": False})


def page_json(path):
    with open(path) as fp:
        return json.load(fp)


@app.route('/sync', methods=['GET'])
def sync():
    """
    return an object containing all of the uploaded pages for a site
    """
    site = request.args.get("site")
    if site is None:
        return jsonify({"error": True})
    folder = host_folder(site, False)
    files = glob.glob(os.path.join(folder, "*.json"))
    pages = {os.path.basename(f)[:-5]: page_json(f) for f in files}
    return jsonify({"pages": pages, "error": False})


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Server to save pages' +
                                     'created with Forager')
    parser.add_argument('--folder', '-F', dest='directory',
                        help='folder to save pages to')
    args = parser.parse_args()
    # default to current working directory
    directory = args.directory or os.path.join(os.getcwd(), 'rules')
    set_directory(directory)
    app.run(debug=True)
else:
    set_directory(os.path.join(os.getcwd(), 'rules'))
