from setuptools import setup, find_packages
from granary import __version__

packages = find_packages(exclude=['tests*'])

setup(
    name="granary",
    version=__version__,
    description="Basic Flask server to pair with CollectorJS for " +
                "uploading collector schemas""",
    packages=packages,
    install_requires=["Flask"],
    url="https://github.com/psherman/granary",
    license="MIT",
    author="Paul Sherman",
    author_email="paul.sherman.88@gmail.com",
)
