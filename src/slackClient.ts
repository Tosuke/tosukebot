import { WebClient, WebAPICallResult ,ChatPostMessageArguments } from '@slack/client'

const client = new WebClient(process.env.SLACK_TOKEN)

export default client

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

interface IM {
  id: string
  is_im: boolean
  user: string
  created: number
  is_user_deleted: boolean
}

export async function postToIm(userId: string, message: Omit<ChatPostMessageArguments, 'channel'>): Promise<WebAPICallResult> {
  const ims = await client.im.list().then((a: any) => (a.ims as IM[]).filter(im => im.user === userId))
  let imid: string
  if (ims.length) {
    imid = ims[0].id
  } else {
    imid = await client.im.open({ user: userId }).then((a: any) => a.channel.id as string)
  }
  return await client.chat.postMessage({
    channel: imid,
    ...message
  })
}
