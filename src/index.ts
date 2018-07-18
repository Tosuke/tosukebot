import dotenv from 'dotenv-safe'
dotenv.config()
import controller from './controller'
import applyServices from './applyServices'

applyServices(controller)

controller
  .spawn({
    token: process.env.SLACK_TOKEN as string
  })
  .startRTM(err => {
    if (err) {
      throw new Error(err)
    }
  })
