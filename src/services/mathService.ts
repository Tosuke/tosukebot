import Botkit, { teamsbot } from 'botkit'
import * as mathjax from 'mathjax-node'
import * as librsvg from 'librsvg'
import crypto from 'crypto'
import s3, { createURL, objectExists } from '../s3Client'

mathjax.start()

function asMathBot(opts: Botkit.SlackMessage): Botkit.SlackMessage {
  return {
    username: 'mathlack bot',
    icon_emoji: ':fxform:',
    ...opts
  }
}

function trimSource(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

export default (controller: Botkit.SlackController) => {
  controller.hears(/^\s*(tex|latex|amath|mathml):([\s\S]*)/, ['ambient', 'direct_message'], async (bot, message) => {
    const src = trimSource(message.match![2])
    const formats = {
      tex: 'TeX',
      latex: 'TeX',
      amath: 'AsciiMath',
      mathml: 'MathML'
    }
    try {
      const url = await processMath(src, formats[message.match![1]])
      let text = `<@${message.user}>`
      if (process.env.NODE_ENV !== 'production') {
        text += ` ${url}`
      }
      bot.reply(
        message,
        asMathBot({
          text,
          attachments: [
            {
              fallback: src,
              image_url: url
            }
          ]
        })
      )
    } catch (e) {
      bot.reply(
        message,
        asMathBot({
          text: `[ERROR] ${e}`
        })
      )
      throw e
    }
  })
}

async function processMath(src: string, format: string): Promise<string> {
  const hash = crypto
    .createHash('md5')
    .update(`${format}-${src}`)
    .digest('hex')
  const objectName = `USLACKBOT/MATH/${hash}.png`
  const renderTask = mathjax
    .typeset({
      math: src,
      format: format,
      svg: true
    })
    .then(res => {
      return svgToPng(res.svg, 4)
    })

  const exists = await objectExists(process.env.S3_BUCKET as string, objectName)
  if (!exists) {
    const pngBuf = await renderTask
    await s3.putObject(process.env.S3_BUCKET as string, objectName, pngBuf)
  }

  return createURL(objectName)
}

function svgToPng(src: string, power: number = 1): Promise<Buffer> {
  return new Promise<Buffer>((res, rej) => {
    const svg = new librsvg.Rsvg()
    svg.on('finish', () => {
      try {
        res(
          svg.render({
            format: 'png',
            width: svg.width * power,
            height: svg.height * power
          }).data
        )
      } catch (e) {
        rej(e)
      }
    })
    svg.end(Buffer.from(src, 'utf8'))
  })
}
