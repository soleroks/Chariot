const Discord = require('discord.js')
const uyeSema = require('../mongo/PoAUser.js')

module.exports = {
    name : Discord.Events.GuildMemberUpdate,
    on:true,
    async execute(oldMember, newMember) {
        if(oldMember.user.bot) return
        
        
        const rolverisial = await oldMember.guild.fetchAuditLogs({
            type: Discord.AuditLogEvent.MemberRoleUpdate,
            limit: 1
        })

        let ilk = rolverisial.entries.first()
    
        if(ilk.executor.bot) return
        let yetkili = ilk.executor
        if(ilk.executor.bot) yetkili = "Sistem"

        if(!ilk.executor.bot) yetkili = `<@${ilk.executor.id}>`
        if(oldMember.roles.cache.size < newMember.roles.cache.size) {


            oldMember.guild.channels.cache.get('1157792298470473789').send({embeds: [new Discord.EmbedBuilder().setColor('Orange').setTitle('Bir üyenin rolleri düzenlendi.')
        
            .addFields(
                {name : "Düzenlenen üye", value: `<@${oldMember.id}>`, inline:true},
                {name : "Eklenen rol", value: `<@&${ilk.changes[0].new[0].id}>`, inline:true},
                {name : "Yetkili", value: `${yetkili}`, inline:true}
            )
        ]})
        
        let bilgiUuu = await uyeSema.findOne({"kullanici.userID": oldMember.id})
        if (bilgiUuu.kullaniciPublic.kullaniciRoller.includes(ilk.changes[0].new[0].id)) return console.log('[❌ UYARI]rol zaten var olduğu için eklenmedi!')

            await uyeSema.findOneAndUpdate({"kullanici.userID": oldMember.id}, 
            {
                $push: {
                    "kullaniciPublic.kullaniciRoller": {rolID: ilk.changes[0].new[0].id}
                }
            })
        }

        if(oldMember.roles.cache.size > newMember.roles.cache.size) {
        
            oldMember.guild.channels.cache.get('1157792298470473789').send({embeds: [new Discord.EmbedBuilder().setColor('Orange').setTitle('Bir üyenin rolleri düzenlendi.')
        
            .addFields(
                {name : "Düzenlenen üye", value: `<@${oldMember.id}>`, inline:true},
                {name : "Silinen rol", value: `<@&${ilk.changes[0].new[0].id}>`, inline:true},
                {name : "Yetkili", value: `${yetkili}`, inline:true}
            )
        ]})
        
            await uyeSema.findOneAndUpdate({"kullanici.userID": oldMember.id}, 
            {
                $pull: {
                    "kullaniciPublic.kullaniciRoller": {rolID: ilk.changes[0].new[0].id}
                }
            })
        }

        if(oldMember.displayName != newMember.displayName) {
            console.log('Bir üyenin kullanıcı adı değişti!')
            await uyeSema.findOneAndUpdate({"kullanici.userID": oldMember.id}, 
            {
                $set: {
                    "kullaniciPublic.kullaniciNick" : newMember.displayName
                }
            })
        }
        
        
    }
}