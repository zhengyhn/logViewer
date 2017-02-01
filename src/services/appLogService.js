
import xhr from 'LIB/xhr'

class AppLogService {
  list ({ startTime = 0, endTime = 0, query = '', page = 0 } = {}) {
    const limit = 10 
    const url = `/applog?startTime=${startTime}&endTime=${endTime}&query=${query}&page=${page}&limit=${limit}`

    return xhr({ url })
  }
}

export default new AppLogService()
