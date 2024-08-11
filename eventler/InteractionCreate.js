const { Events, Collection, EmbedBuilder } = require('discord.js');
const moment = require('moment')
const axios = require('axios')
let ayarlar = require('../config/ayarlar.json')
const apiConfig = require('../config/api.json')
let discord = require('discord.js');
moment.locale('tr')
const {currentTime} = require('../lib/chariot@time')

/** 
 Chariot 3 İnteraksiyon yüklenicisi.


 Yapılanlar:
  
 - Buton desteği eklendi.
 - Modal desteği eklendi.
 - ChariotAPI desteği eklendi.
 - Chariot direktifleri desteği eklendi.
 - Hata kaydedici eklendi.
 */
module.exports = {
	name: Events.InteractionCreate,
	on:true,
	async execute(interaction) {


        
            fetch(`https://chariot3.xyz/api/isValidClient?id=${apiConfig['api.client']}`).then(response => {
                return response.json()
            }).then(async data => {
                if(data.islem === "basarili") {

                    
		if (interaction.isChatInputCommand()) {
            

            if(interaction.channel.type === discord.ChannelType.DM) return interaction.reply({embeds: [new discord.EmbedBuilder().setDescription('Chariot\'a tanımlanan komutları sadece sunucu içerisinde kullanabilirsiniz.').setColor('Red').setFooter({text: `Chariot3 - Yapı: ${ayarlar.info.project.buildName}`, iconURL: "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://chariot3.xyz&size=256"})]})

            const command = interaction.client.commands.get(interaction.commandName);
    
            if (!command) {
                console.error(`${interaction.commandName} bu isimde bir komut yok!`);
                return;
            }
    
            try {
                await command.execute(interaction);
            } catch (error) {
                interaction.client.users.cache.get(ayarlar.owner).send({embeds: [new discord.EmbedBuilder().setTitle('Chariot bir hatayla karşılaştı!').setDescription(`\`\`\`js\n${error}\n\`\`\``).setFooter({text: `Olay ${moment((await currentTime()).current).format('DD/MM/YYYY - hh:mm:ss a')} tarihinde gerçekleşti.`}).setColor('Red')]})
                console.error(error);

            }
        }

        // JRP BUTTON HANDLER
        if(interaction.isButton()) {
         

            await interaction.deferUpdate()

        }
        
    
                }
            
                else if(data.islem === "basarisiz") {
                    console.log('[ChariotAPI] - Chariot API doğrulaması başarısız.')
                }
            })
        


   
	
	},

};
