from setuptools import setup, find_packages

packages = find_packages(exclude=['tests*'])

setup(
    name = "collector",
    version = "0.7.0",
    description = "collect data from webpages",
    packages = packages,
    install_requires = ["cssselect>=0.9.1", "requests>=2", "lxml>=3.3.1", "selenium>=2.43.0"],
    url = "https://github.com/psherman/collector",
    license = "MIT",
    author = "Paul Sherman",
    author_email = "paul.sherman.88@gmail.com",
)
