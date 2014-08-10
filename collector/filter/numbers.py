import re

def integer(num):
    """
    takes a string and returns the value as an int
    call to float because int("13.6") throws a ValueError
    """
    return int(float(clean_number_string(num)))

def decimal(num):
    """
    takes a string and returns the value as a float
    """
    return float(clean_number_string(num))

def clean_number_string(num):
    """
    takes a string representing a number and removes commas, returns a string
    removes commas from a number
    1,234 returns 1234
    """
    return re.sub(",", "", num)

def currency_from_string(num):
    """
    takes a string representing a number and returns a new string formatted to two decimal places
    "1,234,567" => "1234567.00"
    """
    clean = clean_number_string(num)
    return currency_from_number(float(clean))

def currency_from_number(num):
    """
    takes a float/int and returns a string representing the number with two decimal places
    1234.567 => "1234.57"
    """
    return "%.2f" % num
