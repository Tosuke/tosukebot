import * as minio from 'minio'
import { URL } from 'url'
import { Readable } from 'stream'

const endpoint = new URL(process.env.S3_ENDPOINT as string)
const isSecure = endpoint.protocol === 'https:'

const client = new minio.Client({
  endPoint: endpoint.hostname,
  port: endpoint.port !== '' ? parseInt(endpoint.port, 10) : (isSecure ? 443 : 80),
  secure: isSecure,
  accessKey: process.env.S3_ACCESS_KEY as string,
  secretKey: process.env.S3_SECRET_KEY as string
})
export default client

export function createURL(objectName: string, bucket: string = process.env.S3_BUCKET as string): string {
  return `${process.env.S3_ENDPOINT}/${bucket}/${objectName}`
}

export function objectExists(bucketName: string, objectName: string) : Promise<boolean>{
  return new Promise<boolean>((res, rej) => {
    const stream = client.listObjectsV2(bucketName, objectName) as Readable
    stream
      .on('data', () => res(true))
      .on('error', rej)
      .on('end', () => res(false))
  })
}

