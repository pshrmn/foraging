"""
Given a dict represting a rule (from collect-chrome), generate some boilerplate code as a string
"""
import json

def rule_code(rule_obj):
    """
    takes a dict with required keys name, selector, capture, and optional key index
    returns a string represting a call of the collector.rule.Rule function
    """
    index = rule_obj.get("index")
    index_code = (", index=%s" % index) if index else ""
    return "Rule(name=\"%s\", selector=\"%s\", capture=\"%s\"%s)" % (rule_obj["name"],
        rule_obj["selector"], rule_obj["capture"], index_code)

def rules_dict(rule_obj, name):
    """
    returns a string for a group of rules
    """
    lines = []
    for key, val in rule_obj.iteritems():
        lines.append("\t\"%s\": %s" % (key, rule_code(val)))
    rules = ",\n".join(lines)
    output = "%s = {\n%s\n}" % (name, rules)
    return output

def all_code(rule_obj):
    """
    returns a string of code for import statement and objects
    """
    text = "\n".join([rules_dict(val, key) for key, val in rule_obj.iteritems()])
    return "\nfrom collector.rule import Rule\n%s" % text

def boilerplate_file(filename, rule_obj):
    with open(filename, 'r') as fp:
        fp.write(all_code(rule_obj))
