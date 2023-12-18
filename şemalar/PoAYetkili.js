const mongoose = require('mongoose')
const moment = require('moment')

moment.locale('tr')

let PoAYetkili = new mongoose.Schema({

    userID: String,
    YetkiliBakiyeDuzenleyici: {

        bakiyeTargetID: String,
        bakiyeDuzenlenmeZamani: String

    }
})


module.exports = new mongoose.model("poayetkili", PoAYetkili)