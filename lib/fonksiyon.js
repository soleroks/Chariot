const uyeSema = require('../şemalar/PoAUser.js')
const globalSema = require('../şemalar/GlobalEnvanter.js')
const envanterSema = require('../şemalar/PoAEnvanter.js')
const moment = require('moment')
moment.locale('tr')
module.exports = {
    SOLCodeOlustur: function() {
        const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Tüm harfleri içeren bir dize
        let code = "SOL_";
        for (let i = 0; i < 6; i++) { // 4 harfli bir rastgele dize oluşturun
          code += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Ayı iki haneli bir dize olarak alın
        const day = today.getDate().toString().padStart(2, "0"); // Günü iki haneli bir dize olarak alın
        code += `_${month}${day}`; // ccdd kısmını oluşturun
        return code;
    },
    kanalGetir: function(isim) {
    
      if(!isim) return new SyntaxError('[SİSTEM]: "Kanal ismi giriniz."')


      return this.channels.cache.find(x => x.name.endsWith(isim))
    
      },
    uyeGetir: function(uyeisim) {
        if(!uyeisim) return new SyntaxError('[SİSTEM]: "Üye ID\'si giriniz.')

        return this.users.cache.get(uyeisim)
      },
    bakiyeEkle: async function(kisi, kisi2,  miktar) {
        if(!kisi) return new SyntaxError(`[SİSTEM-DB]: Bakiye gönderen üye ID\'si girilmedi!`)
        if(!kisi2) return new SyntaxError('[SİSTEM-DB]: Bakiye alıcı üye ID\'si girilmedi!')
        if(!miktar) return new SyntaxError(`[SİSTEM-DB]: Bakiye miktarı belirtilmedi!`)
        /** 
        console.log(kisi, kisi2, miktar)
*/

        // BAKİYE ÇIKAR - GÖNDEREN KULLANICI
        await uyeSema.findOneAndUpdate({"kullanici.userID": kisi}, {

          $inc: {
            "kullaniciJC.Bakiye": -miktar

          }
        }
        )
        // BAKİYE EKLE - GÖNDERİLEN KULLANICI
        await uyeSema.findOneAndUpdate({"kullanici.userID": kisi2}, {
          $inc: {
            "kullaniciJC.Bakiye": +miktar

          }
        })

        // İŞLEM TÜRÜ BELİRLE - GÖNDEREN ULLANICI

        await uyeSema.findOneAndUpdate({"kullanici.userID": kisi}, {
          $set: {
            "kullaniciJC.BakiyeSonIslem.sonIslemTur": "Giden Para"

          }
        })

        // İŞLEM TÜRÜ BELİRLE - GÖNDERİLEN KULLANICI
        await uyeSema.findOneAndUpdate({"kullanici.userID": kisi2}, {
          $set: {
            "kullaniciJC.BakiyeSonIslem.sonIslemTur": "Gelen Para"

          }
        })

        // ZAMAN BELİRLE - GÖNDEREN KULLANICI

        await uyeSema.findOneAndUpdate({"kullanici.userID": kisi}, {
          $set: {
            "kullaniciJC.BakiyeSonIslem.sonIslemZaman": moment().unix()

          }
        })

        // ZAMAN BELİRLE - GÖNDERİLEN KULLANICI

        await uyeSema.findOneAndUpdate({"kullanici.userID": kisi2}, {
          $set: {
            "kullaniciJC.BakiyeSonIslem.sonIslemZaman": moment().unix()

          }
        })


           // KİŞİ BELİRLE - GÖNDEREN KULLANICI

           await uyeSema.findOneAndUpdate({"kullanici.userID": kisi}, {
            $set: {
              "kullaniciJC.BakiyeSonIslem.sonIslemKısı": kisi2

            }
          })
  
          // KİŞİ BELİRLE - GÖNDERİLEN KULLANICI
  
          await uyeSema.findOneAndUpdate({"kullanici.userID": kisi2}, {
            $set: {
              "kullaniciJC.BakiyeSonIslem.sonIslemKısı": kisi

            }
          })
  

    
      },
    esyaEkle: async function(kisi, kisi2 ,itemİsmi, tradeEligible, minPrice, maxPrice, Market) {


      let yeniID = this.soLCode()
      // KİŞİYE İTEM EKLE
      
        await envanterSema.findOneAndUpdate({userID: kisi}, 
          {
              $push: {
                  userInventory: {
                     itemName: itemİsmi,
                     itemID: yeniID,
                     itemCreatedDate: moment().unix(),
                     itemAddedBy: kisi2,
                     Trade: {
                        isTradeable: tradeEligible,
                        tradeMinPrice: minPrice,
                        tradeMaxPrice: maxPrice,
                        tradeMarket: Market
                     }
                  }
              }
          })
             
      let itemGlobal =  await new globalSema({
          itemName: itemİsmi,
          itemID: yeniID,
          itemCreatedDate: moment().unix(),
          itemAddedBy: kisi2,
          Trade: {
            isTradeable: tradeEligible,
            tradeMinPrice: minPrice,
            tradeMaxPrice: maxPrice,
            tradeMarket: Market
          }
        })

        await itemGlobal.save()

          
      },

    esyaSil: async function(kisi, ID) {
        await envanterSema.findOneAndUpdate({"userID": kisi}, {
          $pull: {
            userInventory: {
              itemID: ID
            }

          }
        })
      }
      
  
      
    }

  
