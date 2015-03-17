import unittest
import os
import json

from collector.schema import (new_schema, new_simple_schema,
                              Schema, SimpleSchema)
from collector.errors import BadJSONError

path = os.path.join(os.getcwd(), "tests", "test_json")


class SchemaTestCase(unittest.TestCase):

    def test_new_schema(self):
        with open(os.path.join(path, "schema.json"), "r") as fp:
            schema_json = json.load(fp)
        s = new_schema(schema_json, None)
        self.assertIsInstance(s, Schema)


class SimpleSchemaTestCase(unittest.TestCase):

    def test_new_simple_schema(self):
        with open(os.path.join(path, "simple_schema.json"), "r") as fp:
            simple_json = json.load(fp)
        s = new_simple_schema(simple_json, None)
        self.assertIsInstance(s, SimpleSchema)

    def test_bad_json(self):
        with open(os.path.join(path, "bad_simple_schema.json"), "r") as fp:
            bad_json = json.load(fp)
        with self.assertRaises(BadJSONError):
            new_simple_schema(bad_json, None)

if __name__ == "__main__":
    unittest.main()
