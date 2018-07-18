import Botkit from 'botkit'
import slack, { postToIm } from '../slackClient'
import s3 from '../s3Client'
import { File } from '../types'
import axios from 'axios'

export default (controller: Botkit.SlackController) => {
  controller.on('file_share', async (bot, message) => {
    const file = (message as any).file as File
    if (file.is_external) return
    const url = await saveFile(file)
    await postToIm(message.user!, {
      username: 'Backup bot',
      icon_emoji: ':frame_with_picture:',
      text: `backed up your file:<${url}|${file.name}>`
    })
  })
}

async function saveFile(file: File): Promise<string> {
  const { data: stream } = await axios.get(file.url_private_download, {
    headers: {
      authorization: `Bearer ${process.env.SLACK_TOKEN}`
    },
    responseType: 'stream'
  })
  const bucket = process.env.S3_BUCKET as string
  const objectName = `${file.id}/${file.name}`
  await s3.putObject(bucket, objectName, stream, file.size)
  return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${file.id}/${encodeURIComponent(file.name)}`
}
