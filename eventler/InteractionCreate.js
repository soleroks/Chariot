const { Events, Collectio, EmbedBuilder } = require('discord.js');
const ayarlar = require('../ayarlar.json')
const moment = require('moment')
moment.locale('tr')
let UyeSema = require('../şemalar/PoAUser.js')
module.exports = {
	name: Events.InteractionCreate,
	on:true,
	async execute(interaction) {
	
		if (interaction.isChatInputCommand()) {

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`${interaction.commandName} bu isimde bir komut yok!`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`${interaction.commandName} komutunu çalıştırırken bir hata meydana geldi. Hata konsola kaydedildi ve geliştiriciye iletildi.`);
			interaction.client.users.cache.get('').send(`Chariot ${moment(Date.now()).format('hh:mm:ss a DD/MM/YYYY')} tarihinde ${interaction.commandName} komutunu kullanırken \n${error}\nhatasıyla karşılaştı. pm2 logundan kontrol ediniz.`)
			console.error(error);
		}
	}
	if(interaction.isContextMenuCommand()) {
		const {commands} = interaction.client;
		const {commandName} = interaction;
		const contextCommand = commands.get(commandName)
		if(!contextCommand) return
	

		try {
			await contextCommand.execute(interaction)
		} catch(error) {
			console.error(error)
		}
	}

	},
};