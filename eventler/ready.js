// CHARIOT3/READY

/**
 
 */

const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('../config/ayarlar.json');
const fs = require('node:fs');
const path = require('node:path');
const moment = require('moment')
const ayarlar = require('../config/ayarlar.json');
const apiConfig = require('../config/api.json')
const mongoose = require('mongoose')
module.exports = {
    name : "ready",
    on:true,
    async execute(on) {

        
        console.log('[CHARIOT] - Chariot Komut Yükselticisi Etkin, komutlar yeniden güncellenecek.')
        
		const commands = [];
			const commandFiles =  fs.readdirSync('./komutlar').filter(s => s.endsWith('.js'));
			for (const file of commandFiles) {
	

				const command = require(`../komutlar/${file}`);	
				if ('data' in command && 'execute' in command) {
					commands.push(command.data.toJSON());
				} else {
					console.log(`[UYARI] ${file} komutunda "data" veya "execute" argümanı eksik. ❌`);
				}
				
			
			}
		
			

const rest = new REST().setToken(token);

(async () => {
	try {
		const data = await rest.put(
			Routes.applicationCommands(ayarlar.clientId, ayarlar.guildId),
			{ body: commands },
		);

		
        let sayi = 0
		commands.forEach(s => {
            sayi++
			console.log(`[KOMUT] - Yüklenen ${sayi}. komut: ${s.name.toUpperCase()} ✅`)
		})

        if(commands.length < 1) {
            await console.log('[İŞLEM] - Hiçbir komut güncellenmedi. ⚠️')
        }
        else {
		await console.log(`[İŞLEM] - ${data.length} adet komut güncellendi ve kullanıma hazır. ✅`);

        }

  
        console.warn('[ChariotAPI] - ChariotAPI erişilebilirliği test ediliyor. ⚠️')

           fetch('https://chariot3.xyz/api/durum').then(response => {
            if(!response.ok) {
                throw new Error('[ChariotAPI] - ChariotAPI hizmetine bağlanılamadı. ❌')
            }
            return response.json();


           }).then(async data => {
            if(data.islem === "basarili") {
                console.log('[ChariotAPI] - ChariotAPI hizmeti aktif ve kullanılabilir durumda. ✅')
            
             
				// mongoose.connect('') connect to mongodb

               await console.log(`[CHARIOT] - Chariot 3, hizmete hazır. ✅`)

            }
           }).catch(error => {
            console.error('[ChariotAPI] - Hizmet esnasında bir hata meydana geldi. ❌')
           })
	} catch (error) {

		console.error(error);
	}
        })();

  
	}
}
    
