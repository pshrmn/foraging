import arrow
import logging

log = logging.getLogger(__name__)


def long_month(date_string):
    """
    return a datetime.date parsed from a string where months are fully written
    out (eg., January, February, etc.)
    """
    try:
        arrow_date = arrow.get(date_string, "MMMM D, YYYY")
        return arrow_date.date()
    except arrow.parser.ParserError:
        log.warning("failed to match date:\t{}".format(date_string))
        return None


def short_month(date_string):
    """
    return a datetime.date parsed from a string where months are abbreviated
    to three characters (eg., Jan, Feb, etc.)
    """
    try:
        arrow_date = arrow.get(date_string, "MMM D, YYYY")
        return arrow_date.date()
    except arrow.parser.ParserError:
        log.warning("failed to match date:\t{}".format(date_string))
        return None
