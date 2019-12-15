import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import clear from 'rollup-plugin-clear'
import html from '@rollup/plugin-html'

const commonOutput = {
  dir: 'dist',
  format: 'esm'
}

const commonPlugins = [clear({ targets: ['dist'] }), json(), resolve()]

const clientOutput = {
  plugins: [html({
    fileName: 'client.html',
    title: 'Gender Reveal!',
    template: ({ attributes, bundle, files, publicPath, title }) => {
      const makeHtmlAttributes = (attributes) => {
        if (!attributes) {
          return ''
        }

        const keys = Object.keys(attributes)
        // eslint-disable-next-line no-param-reassign
        return keys.reduce((result, key) => (result += ` ${key}="${attributes[key]}"`), '')
      }

      const scripts = (files.js || [])
        .map(({ fileName }) => {
          const attrs = makeHtmlAttributes(attributes.script)
          return `<script src="${publicPath}${fileName}"${attrs}></script>`
        })
        .join('\n')

      const links = (files.css || [])
        .map(({ fileName }) => {
          const attrs = makeHtmlAttributes(attributes.link)
          return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`
        })
        .join('\n')

      return `
<!doctype html>
<html${makeHtmlAttributes(attributes.html)}>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    ${links}
  </head>
  <body>
    <main>
      <canvas id="canvas" width="540" height="480" tabindex=0 role="img"></canvas>
    </main>
    ${scripts}
  </body>
</html>`
    }
  })]
}

const puppeteerOutput = {
  plugins: [html({
    fileName: 'puppeteer.html',
    title: 'Puppeteer Template',
    template: ({ attributes, bundle, files, publicPath, title }) => {
      const makeHtmlAttributes = (attributes) => {
        if (!attributes) {
          return ''
        }

        const keys = Object.keys(attributes)
        // eslint-disable-next-line no-param-reassign
        return keys.reduce((result, key) => (result += ` ${key}="${attributes[key]}"`), '')
      }

      const scripts = (files.js || [])
        .map(({ fileName }) => {
          const attrs = makeHtmlAttributes(attributes.script)
          return `<script src="${publicPath}${fileName}"${attrs}></script>`
        })
        .join('\n')

      const links = (files.css || [])
        .map(({ fileName }) => {
          const attrs = makeHtmlAttributes(attributes.link)
          return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`
        })
        .join('\n')

      return `
<!doctype html>
<html${makeHtmlAttributes(attributes.html)}>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    ${links}
  </head>
  <body>
    ${scripts}
  </body>
</html>`
    }
  })]
}

export default [
  {
    input: 'src/client.js',
    output: { ...commonOutput, ...clientOutput },
    plugins: commonPlugins
  },
  {
    input: 'src/puppeteer.js',
    output: { ...commonOutput, ...puppeteerOutput },
    plugins: commonPlugins
  }
]
