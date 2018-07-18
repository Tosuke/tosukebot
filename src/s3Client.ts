import * as minio from 'minio'
import { URL } from 'url'

const endpoint = new URL(process.env.S3_ENDPOINT as string)
const isSecure = endpoint.protocol === 'https:'

export default new minio.Client({
  endPoint: endpoint.hostname,
  port: endpoint.port !== '' ? parseInt(endpoint.port, 10) : (isSecure ? 443 : 80),
  secure: isSecure,
  accessKey: process.env.S3_ACCESS_KEY as string,
  secretKey: process.env.S3_SECRET_KEY as string
})