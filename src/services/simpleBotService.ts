import Botkit from 'botkit'

const configs: { regex: RegExp; username: string; icon: string; text: string }[] = [
  {
    regex: /^おやすみ$/,
    username: 'oyasumi bot',
    icon: ':sleeping_accommodation:',
    text: 'おやすみ'
  },
  {
    regex: /^おはよう$/,
    username: 'ohayou bot',
    icon: ':mostly_sunny:',
    text: 'おはよう！'
  },
  {
    regex: /^ただいま$/,
    username: 'okaeri bot',
    icon: ':house:',
    text: 'おかえり'
  }
]

export default (controller: Botkit.SlackController) => {
  for (const config of configs) {
    controller.hears(config.regex, 'ambient', (bot, message) => {
      bot.reply(message, {
        username: config.username,
        icon_emoji: config.icon,
        text: `<@${message.user}> ${config.text}`,
      })
    })
  }
}
