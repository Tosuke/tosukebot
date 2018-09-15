import Botkit from 'botkit'
import echoService from './services/echoService'
import filesaveService from './services/firesaveService'
import simpleBotService from './services/simpleBotService'
import mathService from './services/mathService'

// 環境変数のフォーマット
const envOf = (name: string) => `USE_${name.toUpperCase()}`;

// 文字列をbooleanにするやつ
const toBool = (value: string) => value.toLowerCase() === "true" ? true : value.toLocaleLowerCase() === "false" ? false : undefined;

// 環境変数にてUSE_**がtrueであるか、undefinedである場合trueを返す関数
const use = (name: string) => {
  var e = process.env[envOf(name)];

  if (e === undefined) {
    return true
  } else {
    return toBool(e);
  }
}

// サービス
const services = [
  { name: "echo", instance: echoService },
  { name: "filesave", instance: filesaveService },
  { name: "math", instance: mathService},
];

export default (controller: Botkit.SlackController) => {
  for (const service of services) {
    if (use(service.name)) {
      console.info(`Initializing ${service.name}...`);
      service.instance(controller);
    }
  }
}
