import Botkit from 'botkit'
import slack, { postToIm } from '../slackClient'
import s3 from '../s3Client'
import { File } from '../types'
import axios from 'axios'

const mutex = new Set<string>()

export default (controller: Botkit.SlackController) => {
  controller.on('file_shared', async (bot, message) => {
    console.log(message)
    const mes: any = message
    const fileId: string = mes.file_id
    
    if (mutex.has(fileId)) return

    mutex.add(fileId)
    const file = ((await slack.files.info({
      file: fileId
    })) as any).file as File
    if (file.is_external) return
    const url = await saveFile(file)
    await postToIm(mes.user_id, {
      username: 'Backup bot',
      icon_emoji: ':frame_with_picture:',
      text: `backed up your file: <${url}|${file.name.replace(/[|<>`\*\_@]/g, '-')}>`
    })
    mutex.delete(fileId)
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
  const escapedFileName = file.name.replace('\\', '_')
  const objectName = `${file.id}/${escapedFileName}`
  await s3.putObject(bucket, objectName, stream, file.size)
  return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${file.id}/${encodeURIComponent(escapedFileName)}`
}
