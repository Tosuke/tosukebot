import Botkit from 'botkit'

export default (controller: Botkit.SlackController) => {
  controller.hears(/^echo:(.*)$/, ['direct_mention', 'direct_message'], (bot, message) => {
    bot.reply(message, message.match![1])
  })
}