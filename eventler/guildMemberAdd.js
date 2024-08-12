
const Discord = require('discord.js')
const moment = require('moment')
const uyeSema = require('../mongo/user.js')

moment.locale('tr')
module.exports = {
    name : Discord.Events.GuildMemberAdd,
    on: true,
    async execute(member) {

      
        const embed = new Discord.EmbedBuilder()
        .setTitle('Sunucuya yeni bir üye katıldı.')
        .addFields(
            {name : "Kullanıcı adı", value: `${member.user.username}`, inline:true},
            {name : "Hesap oluşturma tarihi", value: `${moment(member.user.createdAt).format('hh:mm:ss DD/MM/YYYY')}`, inline:true}
        )
        .setThumbnail(member.user.avatarURL())
        .setColor('Green')
        
        let UyeBilgi = await uyeSema.findOne({"kullanici.userID" : member.id})

        if(UyeBilgi) {
         
            return

        }

       
        else if(!UyeBilgi) {
            // KAYITSIZ EKLEME
/** 
member.roles.add('')
*/
    
        let yeni = new uyeSema(
            {
                "kullanici.userID" : member.id,
                "kullanici.userJoinDate" : member.joinedAt
           
            }

        )
        await yeni.save()

    }



       // join log kanalı member.guild.channels.cache.get('').send({embeds: [embed]})

}
}
