"""
Cleaners' functions take the value argument, do something with it, and return a new value
eg. dollars("$1.99") returns the float 1.99
They use this format so that you can chain together a list of functions
"""
import re

def dollars(value):
    # change must be 1 or 2 characters
    # does not properly check comma's position because they are discarded
    # only matches the first dollar value found in value
    dollar_match = re.findall(r'\$([\d,]+(?:\.\d{1,2})?)', value)
    if len(dollar_match) == 0:
        return 0
    value = dollar_match[0].replace(',','')
    return float(value)

def lowercase(value):
    return value.lower()

def uppercase(value):
    return value.upper()

def capitalize(value):
    return value.capitalize()
