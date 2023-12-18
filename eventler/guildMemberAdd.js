
const Discord = require('discord.js')
const moment = require('moment')
const uyeSema = require('../şemalar/PoAUser.js')
const envanterSema = require('../şemalar/PoAEnvanter.js')
const arkadasSema = require('../şemalar/PoASocial.js')
const coinSema = require('../şemalar/AdvancedEcon.js')

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
            embed.setFooter({text: `Bu kişi daha önce sunucuda ${UyeBilgi.kullaniciPublic.kullaniciNick} ismiyle bulunmuş.`})
            member.send('Sunucuda daha önceden kalma bir üye kaydınız mevcut. Mevcut rolleriniz geri veriliyor. Her hangi bir şey yapmadan kaldığınız yerden devam edebilirsiniz. Path of Ascension\'a hoş geldiniz.')
            console.log(UyeBilgi.kullaniciPublic.kullaniciRoller)
            UyeBilgi.kullaniciPublic.kullaniciRoller.forEach(s => {
                member.roles.add(s.rolID)
            });
            member.edit({nick: UyeBilgi.kullaniciPublic.kullaniciNick})

        }

       
        else if(!UyeBilgi) {
            // KAYITSIZ EKLEME
/** 
member.roles.add('')
*/
    
        let yeni = await new uyeSema(
            {
                "kullanici.userID" : member.id,
                "kullanici.userJoinDate" : member.joinedAt
           
            }

        )
        await yeni.save()


        let yeniEnvanter = await new envanterSema(
            {
                userID : member.id
           
            }
        )
        await yeniEnvanter.save()
        
        let yeniCoin = await new coinSema(
            {
                userID : member.id
           
            }
        )
        await yeniCoin.save()
    }


    member.guild.channels.cache.get('1157792298470473789').send({embeds: [embed]})

}
}
