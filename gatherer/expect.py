"""
Detect changes within a web page to indicate whether a Page's schema works
as expected.
"""


def flatten_element(element):
    """
    flatten the expected types of rules down to a nested dict. Keys are the
    names of rules and values are either the expected type or another dict
    which contains nested rules.

    :param element: a gatherer Element
    :type element: gatherer.Element
    :return: A dict mapping rule names to rule types
    :rtype: dict
    """

    rules = {}
    for rule in element.rules:
        rule_type = rule.type
        if rule_type == "string":
            rules[rule.name] = str
        elif rule_type == "int":
            rules[rule.name] = int
        elif rule_type == "float":
            rules[rule.name] = float
        else:
            # unexpected rule type
            rules[rule.name] = rule_type
    for child in element.children:
        child_rules = flatten_element(child)
        child_type = child.spec.get("type")
        if child_type == "single":
            for name, val in child_rules.items():
                rules[name] = val
        elif child_type == "all":
            child_value = child.spec.get("value")
            rules[child_value] = child_rules
    return rules


def compare(values, expected):
    """
    return a boolean where True means that every returned value exists and has
    the expected type, and False means that at least one unexpected value exists

    :param values: Values gathered by a Page.
    :param expected: Expected type for each value in the gathered
        Page.
    :type values: dict
    :type expected: dict
    :return: True if all expected types match, otherwise False
    :rtype: bool
    """
    good = True
    for key, exp_type in expected.items():
        if good is False:
            break
        value = values.get(key)
        if value is None:
            good = False
        elif isinstance(value, list):
            good = all(compare(v, exp_type) for v in value)
        else:
            good = isinstance(value, exp_type)
    return good


def differences(values, expected):
    """
    return a dict representing the differences between the expected types and
    the actual types that were returned

    :param values: Values gathered by a Page.
    :param expected: Expected type for each value in the gathered
        Page.
    :type values: dict
    :type expected: dict
    :return: A dict of differences in values from their expected types
    :rtype: dict
    """
    diff = {}
    for key, exp_type in expected.items():
        value = values.get(key)
        if value is None:
            diff[key] = {
                "expected": exp_type,
                "actual": type(value),
                "value": value
            }
        elif isinstance(exp_type, dict):
            # when the expected type is a dict, the value should be a list
            if not isinstance(value, list):
                diff[key] = {
                    "expected": list,
                    "actual": type(value),
                    "value": value
                }
            else:
                # only set a diff key when one or more of the items
                # differentiates from the expected
                all_diffs = [differences(item, exp_type) for item in value]
                real_diffs = [d for d in all_diffs if d is not None]
                if len(real_diffs):
                    diff[key] = real_diffs
        else:
            if not isinstance(value, exp_type):
                diff[key] = {
                    "expected": exp_type,
                    "actual": type(value),
                    "value": value
                }
    return diff if diff != {} else None
