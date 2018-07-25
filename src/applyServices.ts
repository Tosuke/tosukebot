import Botkit from 'botkit'
import echoService from './services/echoService'
import filesaveService from './services/firesaveService'
import simpleBotService from './services/simpleBotService'
import mathService from './services/mathService'

const services = [echoService, filesaveService, mathService]

export default (controller: Botkit.SlackController) => {
  for (const service of services) {
    service(controller)
  }
}
