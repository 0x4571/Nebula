const data = require('../data_management')
const casinoData = data.getCasino()

module.exports = {
    isCasinoOpen() {
        const { Schedules } = casinoData;
      
        const currentTime = new Date
        const currentUTCHours = currentTime.getUTCHours();
      
        for (const schedule of Schedules) {
          const [startHour, endHour] = schedule;
      
          if (startHour <= endHour) {
            if (currentUTCHours >= startHour && currentUTCHours < endHour) {
              return true;
            }
          } else {
            if (currentUTCHours >= startHour || currentUTCHours < endHour) {
              return true;
            }
          }
        }
      
        return false;
      }
}