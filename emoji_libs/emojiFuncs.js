const emojiArray = require("./emoji.json");
const twemoji = require("twemoji");

/**
 * Object with information about a specific emoji
 * @typedef {Object} EmojiObject
 * @property {string} char - The emoji as a string literal
 * @property {string} descr - The Unicode description of the emoji in lower case.
 */

/**
 * Error for emoji problems.
 */
class EmojiError extends Error {
  constructor(message) {
    super(message);
    this.name = "EmojiError";
  }
}

/**
 * Decides whether to allow this emoji to be used.
 *
 * Disallows basic Baby, Child, Boy, Girl, Adult, Man, Woman, Older Adult, Old Man, Old Woman emoji
 * Disallows emoji with "police" in their description
 * Disallows emoji with "passport control" in their description
 * Disallows emoji with "customs" in their description
 * Disallows emoji with "Israel" in their description
 * Disallows emoji that twemoji doesn't support
 * @param {EmojiObject} emoji - Information about the emoji
 * @returns {Boolean}
 */
const emojiFilter = (emoji) => {
  const basicEmoji = {
    skinTones: [
      "1F3FB", // light skin tone
      "1F3FC", // medium-light skin tone
      "1F3FD", // medium skin tone
      "1F3FE", // medium-dark skin tone
      "1F3FF", // dark skin tone
    ],
    baseEmoji: [
      "1F476", // Baby
      "1F9D2", // Child
      "1F466", // Boy
      "1F467", // Girl
      "1F9D1", // Adult
      "1F468", // Man
      "1F469", // Woman
      "1F9D3", // Older Adult
      "1F474", // Old Man
      "1F475", // Old Woman
    ],
  };
  const basicEmojiRegex = new RegExp(
    `^(${basicEmoji.baseEmoji.join("|")})( (${basicEmoji.skinTones.join(
      "|"
    )}))?$`
  );
  const descrBanList = [
    "police",
    "female sign",
    "male sign",
    "passport control",
    "customs",
    "Israel",
  ];
  const codePoints = twemoji.convert.toCodePoint(emoji.char, " ").toUpperCase();
  // Emoji that are too basic to be funny in this context
  const isBasicEmoji = basicEmojiRegex.test(codePoints);
  // Emoji that represent things that are too bad to be funny, or too basic
  const hasBannedWord = descrBanList.some((word) => emoji.descr.includes(word));

  return !(isBasicEmoji || hasBannedWord);
};

// Make the filtered emoji objects to use
const filteredEmojiArray = emojiArray.filter((emojiKeyValue) =>
  emojiFilter(emojiKeyValue[1])
);
const filteredEmojiMap = new Map(filteredEmojiArray);

/**
 * Return a randomly chosen entry from `filteredEmojiArray`.
 * @returns {EmojiObject}
 */
const selectRandomEmoji = () => {
  const index = Math.floor(Math.random() * filteredEmojiArray.length);
  const key = filteredEmojiArray[index][0];
  return filteredEmojiMap.get(key);
};

/**
 * Return a fully-qualified emoji object based on the one provided.
 * Throws an error if the emoji is not found in `filteredEmojiMap`.
 * @param {String} emoji - Literal emoji character to search for
 * @returns {EmojiObject}
 */
const resolveEmoji = (emoji) => {
  const singleEmoji = filteredEmojiMap.get(emoji);
  if (singleEmoji) {
    return singleEmoji;
  } else {
    throw new EmojiError(
      `The provided emoji "${emoji}" is not allowed or unavailable.`
    );
  }
};

module.exports = {
  selectRandomEmoji,
  resolveEmoji,
  EmojiError,
};
