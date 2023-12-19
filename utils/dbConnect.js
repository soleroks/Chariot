let ayarlar = require('../ayarlar.json')
const mongoose = require('mongoose')
module.exports = {
    dbSelector: function(db, envDb) {
// DB SELECTOR BURAYA TAŞINACAK


/** 
 *        
        if(ayarlar.dbSelector === "dev") {
            mongoose.connect(ayarlar.dbs.dev)
            console.log('[DB] - Geliştirici veri tabanına bağlanıldı. Bot erişimi herkes için durdurulmuştur.')

			mongoose.createConnection(ayarlar.InvDbs.dev) 
        
            console.log('[DB] - Uzak Envanter veri tabanına bağlanıldı.')

        }
        else if(ayarlar.dbSelector === "live") {
            mongoose.connect(ayarlar.dbs.live)
            console.log('[DB] - Genel kullanım veri tabanına bağlanıldı. İyi roller.')
    
        }
*/ 
/**

    "envDbSelector" : "dev",
 */

if(db === "live") {
    // LIVE DATABASE
    console.log('[DB] - Genel kullanım veri tabanına bağlanıldı. İyi roller.')

     mongoose.connect('')
}

if(db === "dev") {
 // DEV DATABASE

 mongoose.connect('')
 console.log('[DB] - Geliştirici veri tabanına bağlanıldı. Bot erişimi herkes için durdurulmuştur.')
    
}



if(envDb === "live") {
    // LIVE ENVDB
    mongoose.connect


}
if(envDb === "dev") {
    // DEV ENVDB
    mongoose.connect('')
}


    }}
