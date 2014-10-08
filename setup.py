from setuptools import setup, find_packages

packages = find_packages(exclude=['tests*'])

setup(
    name = "pycollector",
    version = "0.6.5",
    description = "collect data from webpages",
    packages = packages,
    install_requires = ["Flask", "cssselect>=0.9.1", "requests>=2", "lxml>=3.3.1", "selenium>=2.43.0"],
    url = "https://github.com/psherman/pycollector",
    download_url = "https://github.com/psherman/pycollector/tarball/0.6.5",
    license = "MIT",
    author = "Paul Sherman",
    author_email = "paul.sherman.88@gmail.com",
)
