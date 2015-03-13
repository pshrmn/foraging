import unittest
import os
import json

from collector.crawl.schema import (Schema, SimpleSchema)
from collector.crawl.errors import BadSimpleSchemaError

path = os.path.join(os.getcwd(), "tests", "test_json")
print path


class SchemaTestCase(unittest.TestCase):

    def test_from_json(self):
        with open(os.path.join(path, "schema.json"), "r") as fp:
            schema_json = json.load(fp)
        s = Schema.from_json(schema_json)
        self.assertIsInstance(s, Schema)


class SimpleSchemaTestCase(unittest.TestCase):

    def test_from_json(self):
        with open(os.path.join(path, "simple_schema.json"), "r") as fp:
            simple_json = json.load(fp)
        s = SimpleSchema.from_json(simple_json)
        self.assertIsInstance(s, SimpleSchema)

    def test_bad_json(self):
        with open(os.path.join(path, "bad_simple_schema.json"), "r") as fp:
            bad_json = json.load(fp)
        with self.assertRaises(BadSimpleSchemaError):
            SimpleSchema.from_json(bad_json)

if __name__ == "__main__":
    unittest.main()
