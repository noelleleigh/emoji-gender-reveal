/* eslint-env browser */
import { drawTitleScreen, renderRandomEmojiScene } from './drawFuncs.js'
import { setupCanvas } from './utils'

const main = async () => {
  const canvas = await setupCanvas(document.querySelector('main'))
  const ctx = canvas.getContext('2d')

  await drawTitleScreen(ctx)

  canvas.addEventListener('click', () => { renderRandomEmojiScene(ctx) })
  canvas.addEventListener('keyup', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      renderRandomEmojiScene(ctx)
    }
  })
}

main()
