import Botkit from 'botkit'
import filesaveService from './services/firesaveService'
import simpleBotService from './services/simpleBotService'

const services = [filesaveService, simpleBotService]

export default (controller: Botkit.SlackController) => {
  for (const service of services) {
    service(controller)
  }
}
