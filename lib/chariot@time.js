const moment = require('moment')
moment.locale('tr')

/**
 * CHARIOT/TIME
 * 
 * Chariot Time is a little time library which can be used in precise time calculations using UNIX timestamps.
 * 
 * Version: 1.2.1
 * Author: soleroks/Chariot
 * Github: github.com/soleroks
 * Licence: GPL-3
 */

console.log('[CHARIOT/TIME] Lütfen kütüphaneyi kullanırken sadece UNIX zaman damgalarını kullanmaya devam edin.')



module.exports = {
/**
 * 1.07.2024 Changelog
 * convertToHumanDate function added.
 * 
 * 
 */
    convertToHumanDate: async function(unix) {

        let tm = moment.unix(unix).format('DD/MM/YYYY - a hh:mm:ss')
        let chariotTime = {convertion: tm, yes: 'yes'}
        return chariotTime

    },

    beforeAWeek: async function(duration){

        let time = moment.unix(duration)

        const week = duration - 604800

        let chariotTime = {week: week}


        return chariotTime
    },

    currentTime: async function() {

        let chariotTime = {current: moment().unix()}
        return chariotTime 
    },
    
    durationBetweenGivenTwoTimes: async function(duration1, duration2) {

        let time1 = moment.unix(duration1)
        let time2 = moment.unix(duration2)

        let durationBetween = moment.duration(time1.diff(time2))

        if(durationBetween.milliseconds.toString().startsWith('-')) return 'Zaman hesaplaması hatası'
        let hours = Math.floor(durationBetween.asHours())
        let days = Math.floor(durationBetween.asDays())
        let minutes = Math.floor(durationBetween.asMinutes())
        let weeks = Math.floor(durationBetween.asWeeks())
        let months = Math.floor(durationBetween.asMonths())
        let years = Math.floor(durationBetween.asYears())
        let chariotTime = {minute: minutes, hour: hours, day: days, week:weeks, month: months, year:years}

        return chariotTime
    },
    // NOT: compare() fonksiyonunun yerine geçti. Daha kesin sonuçlar veriyor ve object döndürüyor. Oldukça ideal.
     durationBetweenGivenTime:async function(durationtoBeCompared) {
      var now = moment()
      let end = moment.unix(durationtoBeCompared)
      let sure = moment.duration(now.diff(end))
      let hours = Math.floor(sure.asHours())
      let days = Math.floor(sure.asDays())
      let minutes = Math.floor(sure.asMinutes())
      let weeks = Math.floor(sure.asWeeks())
      let months = Math.floor(sure.asMonths())
      let years = Math.floor(sure.asYears())
      
      let chariotTime = {minute: minutes, hour: hours, day: days, week:weeks, month: months, year:years}

      return chariotTime


    }
    ,
    // Bu method kullanımdan kaldırıldı, istersen hafta verisi hesaplamak için kullanabilirsin. Çok bir olayı yok ama olsun.
    compare:async function(TimeWillComparedTimeAsEpoch) {
        if(typeof TimeWillComparedTimeAsEpoch !== 'number') return "Geçerli UNIX zaman verisi giriniz. UNIX zaman verileri SADECE rakamlarla belirtilir."

        let moment1 = moment(TimeWillComparedTimeAsEpoch)
        let current = moment().unix()
        let moment2 = moment(current)

        const diff = moment2.diff(moment1, 'weeks')

        if(diff >= 1) {
            return true
        }
        else {
            return false
        }

    }
}