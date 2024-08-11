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
const ayarlar = require('./ayarlar.json')
const path = require('path')
const fs = require('fs')

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



client.on(Discord.Events.InteractionCreate, async interaction => { 
    if (!interaction.isModalSubmit()) return;
    
    if(interaction.customId === "odemeform") {

    const bakiye = interaction.fields.getTextInputValue('uyeBakiyegirisi');
    const Veri = await YetkiliSema.findOne({userID: interaction.user.id})
    console.log(Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID, bakiye);
    if(!interaction.guild.members.cache.get(Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID)) {
    await interaction.reply({ephemeral:true ,content: "Belirtilen üye bulunamadı." });


    }
    else if(!await uyeSema.findOne({"kullanici.userID":Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID })) {
        await interaction.reply({ephemeral:true ,content: "Bu üyeye ait veri yok." });

    }
    else if(interaction.guild.members.cache.get(Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID)) {
        await uyeSema.findOneAndUpdate({"kullanici.userID": Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID}, {
            $inc: {
                "kullaniciJC.Bakiye" : bakiye
            }
        })


        let durum = "ekleme"

        if(bakiye.startsWith('+')) durum = "eklendi"
        if(bakiye.startsWith('-')) durum = "çıkartma"

        await uyeSema.findOneAndUpdate({"kullanici.userID": Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID}, {
            $set: {
                "kullaniciJC.BakiyeSonIslem.sonIslemTur" : `Düzeltme - ${durum}`
            }
        })

        await uyeSema.findOneAndUpdate({"kullanici.userID": Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID}, {
            $set: {
                "kullaniciJC.BakiyeSonIslem.sonIslemZaman" : moment().unix()
            }
        })

        await uyeSema.findOneAndUpdate({"kullanici.userID": Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID}, {
            $set: {
                "kullaniciJC.BakiyeSonIslem.sonIslemKısı" : "Sistem"
            }
        })
        
        await uyeSema.findOneAndUpdate({"kullanici.userID": Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID}, {
            $set: {
                "kullaniciJC.BakiyeSonIslem.sonIslemMiktar" : bakiye
            }
        })
        
        


    
        interaction.reply({embeds: [
            new Discord.EmbedBuilder()
            .setDescription(`<@${Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID}> kişsinin bakiyesi başarıyla düzenlenmiştir.`)
            .setColor('DarkOrange')
            .setFooter({text: "Path of Ascension Bakiye Düzenleyici"})

        ],ephemeral: true})
    }
    }
})
