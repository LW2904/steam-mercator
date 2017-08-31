const EventEmitter = require('events')

// TODO: use of util.inherits is discouraged by nodejs.
require('util').inherits(Bot, EventEmitter)

module.exports = Bot

const User = require('steam-user')
const Community = require('steamcommunity')
const Manager = require('steam-tradeoffer-manager')

const fwd = require('fwd')

function Bot (account) {
  EventEmitter.call(this)

  this.client = new User()
  this.community = new Community()
  this.trader = new Manager({
    steam: this.client,
    domain: 'fsoc.space',
    language: 'en'
  })

  this.cards = {}
  this.inventory = {}
  this.options = {
    spamProtection: false,
    rate: 20,
    keyPrice: 2.3,
    unknown: [ `¯\\_(ツ)_/¯`, 'ಠ_ಠ', '⚆ _ ⚆', 'ಠ~ಠ',  ]
  }

  // These are fatal, allow the app to gracefully shit its pants.
  this.client.on('error', err => {
    this.emit('steamUserError', err)
    setTimeout(this.client.logOn(account), 10*60*1000)
  })

  // Forward all steam interface events to our emitter.
  fwd(this.client, this)
  fwd(this.community, this)
  fwd(this.trader, this)

  // We'll do that ourselves.
  this.client.setOption('promptSteamGuardCode', false)
  this.client.logOn(account)

  this.client.on('steamGuard', (domain, callback) => {
    if (account.shasec) { require('steam-totp').getAuthCode(account.shasec, (e, code) => callback(code)) }
    else { callback(require('readline-sync').question(`${domain ? 'Email' : 'Mobile'} code: `)) }
  })

  // Unlike loggedOn, this only gets emitted when logOn really was successful.
  this.client.on('webSession', (sessionID, cookies) => {
    this.community.setCookies(cookies)
    this.trader.setCookies(cookies)

    // Set state to online.
    this.client.setPersona(1)

    this.steamID = this.client.steamID || this.community.steamID

    this.emit('initialized')
  })
}

// TODO: Add check for valid option value parameter.
Bot.prototype.setOption = function (option, value) {
  this.emit('setOption', option, value, this.options[option])
  this.options[option] = value
}

require('./components/inventory')
require('./components/commands')
require('./components/handlers')
require('./components/helpers')
require('./components/spam')
