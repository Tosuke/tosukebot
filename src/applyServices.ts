import Botkit from 'botkit'
import filesaveService from './services/firesaveService'
import simpleBotService from './services/simpleBotService'
import mathService from './services/mathService'

const services = [filesaveService, mathService]

export default (controller: Botkit.SlackController) => {
  for (const service of services) {
    service(controller)
  }
}
