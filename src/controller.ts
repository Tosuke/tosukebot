import Botkit from 'botkit'

export default Botkit.slackbot({
  debug: process.env.NODE_ENV !== 'production',
  send_via_rtm: true,
  scopes: ['bot'],
})