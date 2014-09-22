from setuptools import setup, find_packages

packages = find_packages()

setup(
    name = "Collector",
    version = "0.5.1",
    packages = packages,
    install_requires = ["Flask", "cssselect>=0.9.1", "requests>=2", "lxml>=3.3.1", "selenium>=2.43.0"],
    author = "Paul Sherman",
    author_email = "paul.sherman.88@gmail.com"
)
