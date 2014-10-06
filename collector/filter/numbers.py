import re

def integer(num):
    """
    :param string num: string to be converted to an int
    """
    return int(float(clean_number_string(num)))

def decimal(num):
    """
    :param string num: string to be converted to a float
    """
    return float(clean_number_string(num))

def clean_number_string(num):
    """
    takes a string representing a number and removes commas, returns a string
    removes commas from a number
    1,234 returns 1234

    :param string num: string representing a number, potentially with commas in it
    """
    return re.sub(",", "", num)

def currency_from_string(num):
    """
    takes a string representing a number and returns a new string formatted to two decimal places
    "1,234,567" => "1234567.00"

    :param string num: string representing a currency amount
    """
    clean = clean_number_string(num)
    return currency_from_number(float(clean))

def currency_from_number(num):
    """
    takes a float/int and returns a string representing the number with two decimal places
    1234.567 => "1234.57"
    """
    return "%.2f" % num
