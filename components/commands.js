let Bot = require('../Bot')

const level = require('../scripts/level')

Bot.prototype._cmdCheck = function (id, args) {
  if (!this.LevelParser)
    this.LevelParser = new (require('steam-level-parser'))(this.rate, this.keyPrice)

  if (!args)
    return this.client.chatMessage(id, `This command requires arguments.`)
  if (args.length > 2)
    return this.client.chatMessage(id, `Invalid number of arguments.`)

  if (args[1]) {
    let data = this.LevelParser.Calculate(parseInt(args[0]), parseInt(args[1]))
    this.client.chatMessage(id, `Level ${args[0]} -> ${args[1]} would require ${data.Intermediate.Exp} EXP (${data.Intermediate.Sets} Sets) and therefore ${data.Intermediate.Keys} Key${data.Intermediate.Keys > 1 ? 's' : ''}.`)
  } else {
    level.get(id)
    .then(level => {
      let data = this.LevelParser.Calculate(level, parseInt(args[0]))
      this.client.chatMessage(id, `Level ${level} -> ${args[0]} would require ${data.Intermediate.Exp} EXP (${data.Intermediate.Sets} Sets) and therefore ${data.Intermediate.Keys} Key${data.Intermediate.Keys > 1 ? 's' : ''}.`)
    }).catch(err => {
      this.client.chatMessage(id, '(ノಠ益ಠ)ノ彡┻━┻ couldn\'t get steam level.')
      this.emit(`levelError`, err)
    })
  }
}
