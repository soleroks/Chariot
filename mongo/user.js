const mongoose = require("mongoose");
const moment = require('moment')
moment.locale('tr')



let user = new mongoose.Schema({
kullanici: {
    userID: String,
    userJoinDate: Number,  
},
kullaniciEco: {
    Bakiye: {
        type: Number,
        default:0
    },
    BakiyeSonIslem: {
        sonIslemMiktar: {
            type: String,
            default: "Kullanıcı henüz işlem yapmamış!"
        },
        sonIslemTur: {
            type: String,
            default: "Kullanıcı henüz işlem yapmamış!"
        },
        sonIslemKısı: {
            type: String,
            default: "Kullanıcı henüz işlem yapmamış!"
        },
        sonIslemZaman: {
            type: Number
        }
    }
},
kullaniciRP: {

    RPPuan: {

        genelPuan: {
            type: Number,
            default:0
        },
        haftalikPuan: {
            type: Number,
            default:0
        }
    },
    RPBilgi: {
        sonKanal: {
            type: String
        },
        sonTarih: {
            type:Number
        },
        sonKanalURL: {
            type: String
        }
    }
},


});


module.exports = new mongoose.model("user", user)