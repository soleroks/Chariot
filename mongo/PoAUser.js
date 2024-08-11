const mongoose = require("mongoose");
const moment = require('moment')
moment.locale('tr')



let PoAUser = new mongoose.Schema({
kullanici: {
    userID: String,
    userJoinDate: Number,  
},
kullaniciJC: {
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

/** 
kullaniciKarakter: {

    kullaniciKarakterSecici: {
        type: Number,
        default:1
    },

    karakter1: {
        karakter1İsim: String,
        karakter1RP: {
            RPPuan: {
                haftalik: {
                    type: Number,
                    default: 0
                },
                genel: {
                    type: Number,
                    default: 0 
                }
            },
            RPBilgi: {
                sonkanal: String,
                sonTarih: Number
            }
        },
        karakter1Roller: [{
            rolId: String
        }]
    },
    karakter2: {
        karakter2İsim: String,
        karakter2RP: {
            RPPuan: {
                haftalik: {
                    type: Number,
                    default:0
                },
                genel: {
                    type:Number,
                    default:0
                }
            },
            RPBilgi: {
                sonkanal: String,
                sonTarih: Number
            }
        },
        karakter2Roller: [{
            rolId: String
        }]
    }
},
*/
kullaniciPublic: {
    ChariotBan: {
        type: Boolean,
        default:false
    },

    kullaniciCeza:[{
        cezaBilgi: {
            cezaSekli: String,
            cezalandiran: String,
            sebep: String,
    
            
        }
    }],
    kullaniciNick: {
        type: String,
        default: "Henüz Karakter Oluşturulmamış."
    },
    kullaniciRoller: [{
        rolID: String
            
    }]
}
});


module.exports = new mongoose.model("PoAUser", PoAUser)