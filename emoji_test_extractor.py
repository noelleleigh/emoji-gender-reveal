"""
Parse https://unicode.org/Public/emoji/12.1/emoji-test.txt into JSON.

When run as main, saves the output to emoji.json
"""
import json
import re
import urllib.request

# Matches the fully-qualified entries in the file
# and has named groups for the character and the description of the emoji
REGEX = re.compile(r'^[^#]*; (?P<status>[^ ]+)\s+# (?P<char>[^ ]+) E\d+\.\d (?P<descr>.+)$')  # noqa: E501

FULLY_QUALIFIED = "fully-qualified"
UNQUALIFIED = "unqualified"
ALLOWED_STATUSES = set((FULLY_QUALIFIED, UNQUALIFIED))


def test_line(string):
    """Test whether a string matches REGEX."""
    return True if re.match(REGEX, string) is not None else False


def extract_info(string):
    """Extract the literal emoji codepoint sequence and the description."""
    matches = re.match(REGEX, string)
    char = matches.group('char')
    descr = matches.group('descr')
    return {
        'char': char,
        'descr': descr
    }


def main(url):
    """Download the url and extract its information into a dictionary.

    Unqualified emoji will reference their fully-qualified versions.
    """
    emoji_map = {}
    qualified_match = None
    with urllib.request.urlopen(url) as response:
        body = response.read().decode()
        lines = body.split('\n')

        for line in lines:
            if not test_line(line):
                # Not an emoji line
                continue

            match = re.match(REGEX, line)
            if match.group('status') not in ALLOWED_STATUSES:
                # Not one of the two statuses
                continue

            if match.group('status') == FULLY_QUALIFIED:
                emoji_map[match.group('char')] = {
                    'char': match.group('char'),
                    'descr': match.group('descr')
                }
                # Save the match if the next line is unqualified
                qualified_match = match
            elif match.group('status') == UNQUALIFIED:
                emoji_map[match.group('char')] = {
                    'char': qualified_match.group('char'),
                    'descr': qualified_match.group('descr')
                }
            else:
                # How did you get here?
                raise ValueError(f'Unknown status: {match.group("status")}')

        return emoji_map


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(
        description='Fetch and process the Unicode 12.1 emoji-test.txt file')
    parser.add_argument('-f', '--format',
                        action='store_const',
                        const=2, default=None,
                        help='Export an indented JSON object')

    args = parser.parse_args()
    emoji = main('https://unicode.org/Public/emoji/12.1/emoji-test.txt')
    emoji_json = json.dumps(emoji, indent=args.format)
    print(emoji_json)
