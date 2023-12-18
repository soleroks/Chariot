const Discord = require('discord.js')
const moment = require('moment')
moment.locale('tr')

module.exports = {
    name : Discord.Events.GuildMemberRemove,
    on: true,
    async execute(member) {


        const kickveriAl = await member.guild.fetchAuditLogs({
            type: Discord.AuditLogEvent.MemberKick,
            limit: 1
        })

        const banveriAl = await member.guild.fetchAuditLogs({
            type: Discord.AuditLogEvent.MemberBanAdd,
            limit:1
        })
        let kickilkVeri = kickveriAl.entries.first()

        let banilkVeri = banveriAl.entries.first()

        const embed = new Discord.EmbedBuilder()


        embed.setTitle('Bir üye sunucudan ayrıldı!')
        embed.setColor('Red')
        embed.addFields(
            {name : "Üye", value: `${member}`, inline:true },
            {name : "Üye ID", value: `${member.id}`, inline:true}
        )
        embed.setFooter({text: `Üye sunucuya ${moment(member.joinedAt).fromNow()} önce katılmış.`, iconURL: member.user.avatarURL()})
        if(banilkVeri) {
            if(banilkVeri.target.id === member.id)
            {
            embed.setDescription('Bu üye yasaklandı!')
            embed.addFields({
                name: "Yasaklayan kişi", value: `<@${banilkVeri.executor.id}>`, inline:true,
                name: "Yasaklanma sebebi", value: `${banilkVeri.reason}`, inline:true
            })
        }
    }
    if(kickilkVeri) {
        if(kickilkVeri.target.id === member.id)
        {
        embed.setDescription('Bu üye sunucudan atıldı!')
        embed.addFields({
            name: "Atan kişi", value: `<@${kickilkVeri.executor.id}>`, inline:true,
            name: "Atılma sebebi", value: `${kickilkVeri.reason}`, inline:true
        })
    }
}


        member.guild.channels.cache.get('1157792298470473789').send({embeds: [embed]})

    }
}