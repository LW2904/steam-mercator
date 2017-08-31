let Bot = require('../Bot')

Bot.prototype.setupHandlers = function () {
	this.client.on('friendMessage', (steamID, message) => {
		if (!this.options.spamProtection || !this.spam(steamID, message)) {
			// TODO: Replace sub-par parse algorithm.
			if (message.indexOf('!') === 0) {
				this.emit('cmd', steamID,
					message.indexOf(' ') !== -1 ? message.slice(1, message.indexOf(' ') + 1).trim() : message.slice(1),
		      message.indexOf(' ') !== -1 ? message.slice(message.indexOf(' ') + 1).split(' ') : false
				)
			} else this.client.chatMessage(steamID, `Couldn't parse message.`)
		} else this.emit('spamMessage', steamID)
	})

	this.client.on('friendRelationship', (steamID, rel) => {
		this.emit('relChange', steamID, rel)
		// Steam.EFriendRelationship.RequestRecipient
		if (rel === 2) {
			this.client.addFriend(steamID, (err, name) => {
				this.emit('addedFriend', steamID, name)
			})
		}
	})
}

Bot.prototype.handle = function (id, cmd, args = []) {
	// TODO: Commands object to allow just doing this.commands[cmd](args).
	switch (cmd) {
		case 'fsoc': this.client.chatMessage(id, `Hello, friend.`)
		break
		case 'version': this.client.chatMessage(id, require('../package.json').version)
		break
		case 'check': this._cmdCheck(id, args)
		break
		default: this.client.chatMessage(id, this.options.unknown[Math.floor(Math.random() * this.options.unknown.length)])
		break
	}
}
