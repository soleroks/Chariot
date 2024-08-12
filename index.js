/**
 * Chariot 1.4 (Venice)
 * 
 * - Chariot 1'in üzerine ufak çaplı hata düzeltmeleri ve fonksiyon geliştirmeleri içeren, Chariot 2 uyumlu bir ara sürümdür.
 * 
 * Yapılan değişiklikler:
 *	 - Gereksiz event ve komutlar silindi.
	 - ChariotAPI entegrasyonu eklendi.
	 - Chariot kullanıcı direktifleri desteği eklendi. 
	 - Sağ tık komutları düzenlendi.
	 - Gereksiz kütüphane dosyaları kaldırıldı.
	 - Chariot Time eklendi.
	 - 
 */
const Discord = require('discord.js')
const mongoose = require('mongoose')
const moment = require('moment')
moment.locale('tr')
const allIntents = new Discord.IntentsBitField(3276799)
const client = new Discord.Client({partials: [Discord.Partials.Message],intents: [allIntents, Discord.GatewayIntentBits.GuildMembers]})
const ayarlar = require('./config/ayarlar.json')
const path = require('path')
const fs = require('fs')

client.login(ayarlar.token)



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
