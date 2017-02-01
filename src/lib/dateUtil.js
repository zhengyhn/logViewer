import Moment from 'moment-timezone'

class DateUtil {
  moment(date) {
    return Moment(date).tz('UTC')
  }

  format(date, format) {
    return this.moment(date).format(format || 'YYYY-MM-DD HH:mm:ss')
  }
}

export default new DateUtil()
