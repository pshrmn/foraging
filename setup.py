from setuptools import setup, find_packages

packages = find_packages(exclude=['tests*'])

setup(
    name = "uploador",
    version = "0.7.0",
    description = "Basic Flask server to pair with CollectorJS for uploading collector schemas",
    packages = packages,
    install_requires = ["Flask"],
    url = "https://github.com/psherman/pycollector-upload",
    license = "MIT",
    author = "Paul Sherman",
    author_email = "paul.sherman.88@gmail.com",
)
