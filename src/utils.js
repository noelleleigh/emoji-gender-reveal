/**
 * Take a string and split it into an array of strings, each less than a maximum character count
 * (unless a single word is longer)
 * Doesn't support combined unicode characters
 * @param {String} longString - String to be split
 * @param {Number} maxLineLength - Number of characters a line should have at most
 * @returns {String[]}
 */
const splitStringLines = (longString, maxLineLength) => {
  const words = longString.split(' ')
  const lines = []
  let currentLine = ''
  for (let word of words) {
    if (currentLine === '') {
      currentLine = word
    } else if (currentLine.length + 1 + word.length < maxLineLength) {
      currentLine += ' '
      currentLine += word
    } else if (currentLine.length + 1 + word.length >= maxLineLength) {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

export { splitStringLines }
