// Arkadaşlık sistemi gibi şeyler bu şema ile ayarlanacak.

const mongoose = require('mongoose')

let PoASocial = new mongoose.Schema({
    userID: String,
    userFriends: [{
        friendID: String,
        friendAddDate: String
    }]
})

module.exports = new mongoose.model("poasocial", PoASocial)