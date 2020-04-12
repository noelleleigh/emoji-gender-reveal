"""
Parse https://unicode.org/Public/emoji/12.1/emoji-test.txt into JSON.

When run as main, outputs the JSON to stdout
"""
import json
import re
import urllib.request

# Matches the emoji entries in the file and has named groups for the status,
# character, and the description/name of the emoji
REGEX = re.compile(r'^[^#]*; (?P<status>[^ ]+)\s+# (?P<char>[^ ]+) E\d+\.\d (?P<descr>.+)$')  # noqa: E501

# Emoji statuses to take action on
FULLY_QUALIFIED = "fully-qualified"
UNQUALIFIED = "unqualified"
GOOD_STATUSES = set((FULLY_QUALIFIED, UNQUALIFIED))


def test_line(string):
    """Test whether a string matches REGEX."""
    return True if re.match(REGEX, string) is not None else False


def make_map_tuple(key, char, descr):
    """Return a (key, value) tuple suitable for a JavaScript Map.

    The value is a dictionary of char and descr."""
    return (key, {"char": char, "descr": descr})


def main(url):
    """Download the url and extract its information into a list of tuples.

    The output format is suitable for constructing a Map in JavaScript, meaning
    a list of 2-tuples.
    Unqualified emoji will reference their fully-qualified versions.
    """
    emoji_list = []
    qualified_match = None
    with urllib.request.urlopen(url) as response:
        body = response.read().decode()
        lines = body.split('\n')

        for line in lines:
            match = re.match(REGEX, line)

            if (match is None) or (match.group('status') not in GOOD_STATUSES):
                # Not an emoji line or not one of the two statuses
                continue

            if match.group('status') == FULLY_QUALIFIED:
                emoji_list.append(
                    make_map_tuple(
                        key=match.group('char'),
                        char=match.group('char'),
                        descr=match.group('descr')
                    )
                )
                # Save the match if the next line is unqualified
                qualified_match = match
            elif match.group('status') == UNQUALIFIED:
                emoji_list.append(
                    make_map_tuple(
                        key=match.group('char'),
                        char=qualified_match.group('char'),
                        descr=qualified_match.group('descr')
                    )
                )
            else:
                # How did you get here?
                raise ValueError(f'Unknown status: {match.group("status")}')

        return emoji_list


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(
        description=(
            'Fetch and process the Unicode 12.1 emoji-test.txt file '
            ' into JSON format'
        )
    )
    parser.add_argument('-f', '--format',
                        action='store_const',
                        const=2, default=None,
                        help='Export an indented JSON object')

    args = parser.parse_args()
    emoji = main('https://unicode.org/Public/emoji/12.1/emoji-test.txt')
    emoji_json = json.dumps(emoji, indent=args.format)
    print(emoji_json)
