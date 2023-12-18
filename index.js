// CHARIOT V14 BY SOLEROKS

// TANOMLAR

const Discord = require('discord.js')
const mongoose = require('mongoose')
let fonksiyon = require('./utils/fonksiyon.js')
const moment = require('moment')
moment.locale('tr')
const allIntents = new Discord.IntentsBitField(3276799)
const client = new Discord.Client({partials: [Discord.Partials.Message],intents: [allIntents, Discord.GatewayIntentBits.GuildMembers]})
const ayarlar = require('./ayarlar.json')
const path = require('path')
const fs = require('fs')
const { error } = require('console')
// BOOT
client.on('ready', on => {
    client.user.setPresence({status: "idle"})
	
	let bilgi = ayarlar.dbSelector
	let bilgi2 = ""
	if(bilgi === "dev") bilgi2 = "bakım"
	if(bilgi === "live") bilgi2 = "sunucu"

})
// APİ GİRİŞ
client.login(ayarlar.token.dev)

// EVENT HANDLER
const eventsPath = path.join(__dirname, 'eventler');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if(event.name) {
		console.log(`[EVENT] - ${event.name} eventi ${file} dosyasından başarıyla yüklendi. ✅`)
	}
	else if(!event.name) {
		console.log(`[EVENT] - ${file} dosyasında bir problem mevcut. event yüklenmedi. ❌`)
	}
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// COMMAND HANDLER INDEX
client.commands = new Discord.Collection();

const commandsPath = path.join(__dirname, 'komutlar');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[UYARI] ${filePath} yolundaki komut "data" veya "execute" argümanı içermiyor. ℹ`);
	}
}
// FONKSİYONLAR
client.soLCode = fonksiyon.SOLCodeOlustur
client.kanalGetir = fonksiyon.kanalGetir
client.uyeGetir = fonksiyon.uyeGetir
client.bakiyeTransfer = fonksiyon.bakiyeEkle
client.mongoose = require('mongoose')
client.itemEkle = fonksiyon.esyaEkle
client.itemCikar = fonksiyon.esyaSil
client.dbBaglan = require('./utils/dbConnect.js').dbSelector
// BAKİYE DÜZENLEYİCİ INDEX

/** 
client.on(Discord.Events.InteractionCreate, async interaction => { 
	if (!interaction.isModalSubmit()) return;
	

	const bakiye = interaction.fields.getTextInputValue('uyeBakiyegirisi');
	const ID = interaction.fields.getTextInputValue('uyeIDgirisi');
	console.log(bakiye, ID);
	if(!interaction.guild.members.cache.get(ID)) {
	await interaction.reply({ephemeral:true ,content: "Bu ID'ye sahip bir üye sunucuda olmadığı için işleminize devam edilemedi. Lütfen düzenlemek istediğiniz üyenin ID'sini kontrol edip tekrar deneyiniz." });


	}


});
*/
