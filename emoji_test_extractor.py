"""
Parse https://unicode.org/Public/emoji/11.0/emoji-test.txt into JSON.

When run as main, saves the output to emoji.json
"""
import re
import json
import requests

REGEX = re.compile(r'^((([0-9A-F]+) )+)\s+; fully-qualified\s+# ([^ ]+) (.+)')


def test_line(string):
    """Test whether a string matches REGEX."""
    return True if re.match(REGEX, string) is not None else False


def extract_info(string):
    """Extract the literal emoji codepoint sequence and the description."""
    matches = re.match(REGEX, string)
    char = matches.group(4)
    descr = matches.group(5)
    return {
        'char': char,
        'descr': descr
    }


def main(url):
    """Download the url and extract its information into a list of dicts."""
    response = requests.get(url)
    emoji = [
        extract_info(line) for line in
        response.text.split('\n')
        if test_line(line)
    ]
    return emoji


if __name__ == '__main__':
    emoji = main('https://unicode.org/Public/emoji/11.0/emoji-test.txt')
    with open('emoji.json', 'w') as f:
        json.dump(emoji, f, indent=None)
