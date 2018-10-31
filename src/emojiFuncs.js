/* eslint-env browser */
import twemoji from 'twemoji'
import emojiArray from './emoji.json'

/**
 * Return a randomly chosen entry from `emojiArray` that is supported by twemoji.
 * @param {Object[]} emojiArray - Array of objects containing `char` properties
 * @returns {Object} {char: <String>, descr: <String>}
 */
const selectRandomEmoji = (emojiArray) => {
  const index = Math.floor(Math.random() * emojiArray.length)
  return emojiArray[index]
}

/**
 * Handles boilerplate so you can get access to an HTMLImage element of the emoji to do stuff with.
 * @param {Function} imgLoadCallback - Callback function that takes an image load event when the
 * emoji image has finished loading and is ready to be used
 * @returns {Function} Function for the callback option of the twemoji.parse function
 */
const useTwemojiImage = (imgLoadCallback) => {
  return (icon, options) => {
    const resolution = options.size.split('x').map(val => Number.parseInt(val, 10))
    const image = new Image(...resolution)
    image.crossOrigin = 'anonymous'
    image.src = `${options.base}${options.size}/${icon}.png`
    image.addEventListener('load', imgLoadCallback)
  }
}

/**
 * Decides whether to allow this emoji to be used.
 * Disallows basic Baby, Child, Boy, Girl, Adult, Man, Woman, Older Adult, Old Man, Old Woman emoji
 * Disallows emoji with "police" in their description
 * Disallows emoji with "passport control" in their description
 * Disallows emoji with "customs" in their description
 * Disallows emoji that twemoji doesn't support
 * @param {Object} emoji - Object with `char` and `descr` properties
 * @returns {Boolean}
 */
const emojiFilter = (emoji) => {
  const basicEmoji = {
    'skinTones': [
      '1F3FB', // light skin tone
      '1F3FC', // medium-light skin tone
      '1F3FD', // medium skin tone
      '1F3FE', // medium-dark skin tone
      '1F3FF' // dark skin tone
    ],
    'baseEmoji': [
      '1F476', // Baby
      '1F9D2', // Child
      '1F466', // Boy
      '1F467', // Girl
      '1F9D1', // Adult
      '1F468', // Man
      '1F469', // Woman
      '1F9D3', // Older Adult
      '1F474', // Old Man
      '1F475' // Old Woman
    ]
  }
  const basicEmojiRegex = new RegExp(`^(${basicEmoji.baseEmoji.join('|')})( (${basicEmoji.skinTones.join('|')}))?$`)
  const descrBanList = [
    'police',
    'female sign',
    'male sign',
    'passport control',
    'customs'
  ]
  const codePoints = twemoji.convert.toCodePoint(emoji.char, ' ').toUpperCase()
  const isBasicEmoji = basicEmojiRegex.test(codePoints)
  const hasBannedWord = descrBanList.some(word => emoji.descr.includes(word))

  return !(isBasicEmoji || hasBannedWord)
}

const filteredEmojiArray = emojiArray.filter(emojiFilter)

export { filteredEmojiArray, useTwemojiImage, selectRandomEmoji }
