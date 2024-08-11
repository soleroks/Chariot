const Discord = require('discord.js')
const moment = require('moment')
moment.locale('tr')
const uyeSema = require('../mongo/PoAUser.js')
module.exports = {

    data: new Discord.SlashCommandBuilder()
    .setName('ödeme')
    .setDescription('[YETKİLİ] Üyelere ödeme yapılmasını sağlar')
    .addStringOption(option => 
        option.setName('tür')
        .setDescription('Yapılacak ödemenin türünü seçiniz.')
        .setRequired(true)
        .addChoices(
            
               { name: "Maaş", value: "maas_haftalik"},
            
                ))
                .addNumberOption(option => 
                    option.setName('miktar')
                    .setDescription('Yatırılacak ödeme miktarını belirtin.')
                    .setRequired(true)),

    async execute(interaction) {

        let veri = interaction.options.getString('tür')

        let rakamm = interaction.options.getNumber('miktar')
        if(veri === "maas_haftalik") {
            // İŞLETME VERGİLERİ
            interaction.guild.members.cache.filter(x => x.roles.cache.get('1161052493812342864')).forEach(async sss=> {

                // %5 sabit 
                // 5000 %1 
                // 10000 %2
                // 15000 %3
                // 20000 %4
                // 25000 %5
                
                let sbilgi = await uyeSema.findOne({"kullanici.userID": sss.id})
                
                var yuzde = (5 / 100) * sbilgi.kullaniciJC.Bakiye;

                var yuzde1 = (6 / 100) * sbilgi.kullaniciJC.Bakiye
                var yuzde2 = (7 / 100) * sbilgi.kullaniciJC.Bakiye
                var yuzde3 = (8 / 100) * sbilgi.kullaniciJC.Bakiye
                var yuzde4 = (9 / 100) * sbilgi.kullaniciJC.Bakiye
                var yuzde5 = (10 / 100) * sbilgi.kullaniciJC.Bakiye
             




                

                
                        
                await uyeSema.findOneAndUpdate({"kullanici.userID": sss.id}, {
                    $inc: {
                        "kullaniciJC.Bakiye": -Math.round(yuzde)
                    }
                })
                
                if(sbilgi.kullaniciJC.Bakiye > 5000 && sbilgi.kullaniciJC.Bakiye < 10000) {

                                   
                await uyeSema.findOneAndUpdate({"kullanici.userID": sss.id}, {
                    $inc: {
                        "kullaniciJC.Bakiye": -Math.round(yuzde1)
                    }
                })
                
                }
                if(sbilgi.kullaniciJC.Bakiye > 10000 && sbilgi.kullaniciJC.Bakiye < 15000) {

                                   
                    await uyeSema.findOneAndUpdate({"kullanici.userID": sss.id}, {
                        $inc: {
                            "kullaniciJC.Bakiye": -Math.round(yuzde2)
                        }
                    })
                    
                    }

                    if(sbilgi.kullaniciJC.Bakiye > 15000 && sbilgi.kullaniciJC.Bakiye < 20000) {

                                   
                        await uyeSema.findOneAndUpdate({"kullanici.userID": sss.id}, {
                            $inc: {
                                "kullaniciJC.Bakiye": -Math.round(yuzde3)
                            }
                        })
                        
                        }
                        if(sbilgi.kullaniciJC.Bakiye > 20000 && sbilgi.kullaniciJC.Bakiye < 25000) {

                                   
                            await uyeSema.findOneAndUpdate({"kullanici.userID": sss.id}, {
                                $inc: {
                                    "kullaniciJC.Bakiye": -Math.round(yuzde4)
                                }
                            })
                            
                            }

                            if(sbilgi.kullaniciJC.Bakiye > 25000) {

                                   
                                await uyeSema.findOneAndUpdate({"kullanici.userID": sss.id}, {
                                    $inc: {
                                        "kullaniciJC.Bakiye": -Math.round(yuzde5)
                                    }
                                })
                                
                                }
            })

            // MAAŞ ÖDEMESİ
            interaction.guild.members.cache.forEach(async s => {
                
                let bilgi = await uyeSema.findOne({"kullanici.userID": s.id})
                if(bilgi) {
                    await uyeSema.findOneAndUpdate({"kullanici.userID": s.id}, {
                        $inc : {

                            "kullaniciJC.Bakiye": +rakamm

                        }
                    })

                    await uyeSema.findOneAndUpdate({"kullanici.userID": s.id}, {
                        $set : {

                            "kullaniciJC.BakiyeSonIslem.sonIslemMiktar": `${rakamm}`

                        }
                    })

                    await uyeSema.findOneAndUpdate({"kullanici.userID": s.id}, {
                        $set : {

                            "kullaniciJC.BakiyeSonIslem.sonIslemTur": "Haftalık Maaş Ödemesi"

                        }
                    })
                    ""
                    await uyeSema.findOneAndUpdate({"kullanici.userID": s.id}, {
                        $set : {

                            "kullaniciJC.BakiyeSonIslem.sonIslemZaman": moment().unix()

                        }
                    })

                    await uyeSema.findOneAndUpdate({"kullanici.userID": s.id}, {
                        $set : {

                            "kullaniciJC.BakiyeSonIslem.sonIslemKısı": "Sistem"

                        }
                    })
                    
                    
                
                }
                
                else if(!bilgi) {
                    return
                } 
            });

            interaction.reply({embeds: [new Discord.EmbedBuilder().setDescription('Haftalık maaş ödemesi başarıyla yapıldı').setFooter({text: `Tüm üyelere toplam ${rakamm} bakiye yatırıldı. Vergilendirmeler kesildi.`})]})

        }

        

    

        
    }
}