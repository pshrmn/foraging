from setuptools import setup, find_packages
import re

packages = find_packages(exclude=['tests*'])

version = ""
with open("gatherer/__init__.py", "r") as fp:
    contents = fp.read()
    version = re.search(r'^__version__\s*=\s*[\'"]([^\'"]*)[\'"]',
                        contents, re.MULTILINE).group(1)

if not version:
    raise RuntimeError("Cannot find version information")

setup(
    name="gatherer",
    version=version,
    description="collect data from webpages",
    packages=packages,
    install_requires=["cssselect>=0.9.1", "requests>=2", "lxml>=3.5.0"],
    url="https://github.com/pshrmn/foraging/gatherer",
    license="MIT",
    author="Paul Sherman",
    author_email="paul.sherman.88@gmail.com",
)
