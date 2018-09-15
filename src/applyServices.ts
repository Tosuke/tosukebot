import Botkit from 'botkit'
import echoService from './services/echoService'
import filesaveService from './services/firesaveService'
import simpleBotService from './services/simpleBotService'
import mathService from './services/mathService'

// 環境変数のフォーマット
const envOf = (name: string) => `USE_${name.toUpperCase()}`;

// 環境変数にてUSE_**がtrueであるか、undefinedである場合trueを返す関数
const use = (name: string) => process.env[envOf(name)] === undefined ? true : process.env[envOf(name)];


// サービス
const services = [
  { name: "echo", instance: echoService },
  { name: "filesave", instance: filesaveService },
  { name: "math", instance: mathService},
  { name: "simple_bot", instance: simpleBotService },
];

export default (controller: Botkit.SlackController) => {
  for (const service of services) {
    if (use(service.name)) {
      console.info(`Initializing ${service.name}...`);
      service.instance(controller);
    }
  }
}
