const mongoose = require('mongoose')
const moment = require('moment')
moment.locale('tr')
const ayarlar = require('../ayarlar.json')

let PoAEnvanter = new mongoose.Schema({
    userID: String,
    InventoryMax: {
        type: Number,
        default: 25,
        
    },
    userInventory: [{
        itemName: String,
        itemID: String,
        itemCreatedDate: String,
        itemAddedBy: String,
        Trade: {
            isTradeable: Boolean,
            tradeMinPrice: Number,
            tradeMaxPrice: Number,
            tradeMarket: {
                type: String,
                default: "Sunucu",  

            }
        }
    }]
})
const EnvDb = mongoose.connection.useDb('envanterDev')

module.exports =  EnvDb.model("user", PoAEnvanter)

