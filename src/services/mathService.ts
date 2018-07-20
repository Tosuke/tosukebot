import Botkit from 'botkit'
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

export default (controller: Botkit.SlackController) => {
  controller.hears(/^\s*(?:la)?tex:([\s\S]*)/, 'ambient', async (bot, message) => {
    const src = message
      .match![1].replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    try {
      const hash = crypto
        .createHash('md5')
        .update(src)
        .digest('hex')
      const objectName = `USLACKBOT/MATH/${hash}.png`
      const renderTask = mathjax
        .typeset({
          math: src,
          format: 'TeX',
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

      bot.reply(
        message,
        asMathBot({
          text: `<@${message.user}>`,
          attachments: [
            {
              fallback: src,
              image_url: createURL(objectName)
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
