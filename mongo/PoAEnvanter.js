const mongoose = require('mongoose')
const moment = require('moment')
moment.locale('tr')

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

module.exports =  EnvDb.model("user", PoAEnvanter)

