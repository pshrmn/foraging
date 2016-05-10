"""
Detect changes within a web page to indicate whether a Page's schema works
as expected.
"""


def flatten_element(element, optional=False):
    """
    flatten the expected types of rules down to a nested dict. Keys are the
    names of rules and values are a tuple where the first item is either the
    expected type or another dict which contains nested rules and the second
    item is whether or not the rule is optional.

    :param element: a gatherer Element
    :type element: gatherer.Element
    :return: A dict mapping rule names to rule types
    :rtype: dict
    """

    # an element's rules will be optional if either it or its ancestors
    # is optional
    is_optional = element.optional or optional

    data = {}
    _type = element.spec.get("type")
    rule_data = flatten_rules(element, is_optional)

    for child in element.children:
        for key, val in flatten_element(child, is_optional).items():
            rule_data[key] = val

    if _type == "single":
        return rule_data
    elif _type == "all" or _type == "range":
        name = element.spec.get("name")
        data[name] = (rule_data, is_optional)
        return data


def flatten_rules(element, optional):
    rules = {}
    for rule in element.rules:
        rule_type = rule.type
        if rule_type == "string":
            rules[rule.name] = (str, optional)
        elif rule_type == "int":
            rules[rule.name] = (int, optional)
        elif rule_type == "float":
            rules[rule.name] = (float, optional)
        else:
            # unexpected rule type
            rules[rule.name] = (rule_type, optional)
    return rules


def compare(data, expected):
    """
    return a boolean where True means that every returned value exists and has
    the expected type, and False means that at least one unexpected value exists

    :param data: Values gathered by a Page.
    :param expected: Expected type for each value in the gathered
        Page.
    :type data: dict
    :type expected: dict
    :return: True if all expected types match, otherwise False
    :rtype: bool
    """
    good = True
    for key, expected in expected.items():
        if good is False:
            break
        value = data.get(key)
        _type, optional = expected
        if value is None:
            if not optional:
                good = False
            else:
                continue
        # iterate over items in the list, verifying the data
        # for each one
        elif isinstance(value, list):
            # _type is a dict of rules for all/range elements
            # and their children
            good = all(compare(v, _type) for v in value)
            continue
        else:
            good = isinstance(value, _type)
    return good


def differences(data, expected):
    """
    return a dict representing the differences between the expected types and
    the actual types that were returned

    :param data: Values gathered by a Page.
    :param expected: Expected type for each value in the gathered
        Page.
    :type data: dict
    :type expected: dict
    :return: A dict of differences in value types from their expected types
    :rtype: dict
    """
    diff = {}
    for key, expected in expected.items():
        value = data.get(key)

        _type, optional = expected
        if value is None:
            if not optional:
                diff[key] = {
                    "expected": _type,
                    "actual": type(value),
                    "value": value
                }
            else:
                continue
        elif isinstance(_type, dict):
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
                all_diffs = [differences(item, _type) for item in value]
                real_diffs = [d for d in all_diffs if d is not None]
                if real_diffs:
                    diff[key] = real_diffs
            continue
        else:
            if not isinstance(value, _type):
                diff[key] = {
                    "expected": _type,
                    "actual": type(value),
                    "value": value
                }
    return diff if diff != {} else None
