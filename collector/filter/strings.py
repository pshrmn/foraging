import re


def clean_whitespace(text):
    """
    given a string, replace instances of 1+ whitespace characters with a
    single space strip all whitespace off the ends of the string

    :param string text: string with extra whitespace
    """
    return re.sub("\s+", " ", text.strip())


def clean_extra_spaces(text):
    """
    given a string, replace instances of 2+ spaces with a single space
    strip all whitespace off the ends of the string

    :param string text: string with extra spaces
    """
    return re.sub(" +", " ", text.strip())
