const ayarlar = require('../ayarlar.json')
const Discord = require('discord.js')

module.exports = {
    data: new Discord.SlashCommandBuilder()

    .setName('eval')
    .setDescription('[SAHİP] Belirtilen kod bloğunu çalıştırır. (Sadece geliştirici modunda aktiftir.)')
    .addStringOption(option =>
		option.setName('kod')
			.setDescription('Yürütülecek kod bloğunu girin.')
            .setRequired(true)

            ),
    async execute(interaction) {


                if(!ayarlar.sahip.includes(interaction.user.id)) return interaction.reply({ephemeral:true, content: "Bu komutu sadece sunucu sahibi kullanabilir."})
               
                if(ayarlar.dbSelector === "live") return interaction.reply({ephemeral:true, content: "Bot bakım modunda değil!"})
                let veri = await interaction.options.getString('kod')

                try {
                    let codein = veri;
                    let code = eval(codein);
            
                    if (typeof code !== 'string')
                        code = require('util').inspect(code, { depth: 0 });
                    let çıkış = (`\`\`\`js\n${code}\n\`\`\``)
                  interaction.reply(çıkış)
                } catch(e) {
                  interaction.reply(`\`\`\`js\n${e}\n\`\`\``);
                }
    
           
            
    

            }
}