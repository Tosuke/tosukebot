import Botkit from 'botkit'
import filesaveService from './services/firesaveService'

const services = [filesaveService]

export default (controller: Botkit.SlackController) => {
  for(const service of services) {
    service(controller)
  }
}