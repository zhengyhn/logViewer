const rootPath = 'http://192.168.1.169:9090'

const xhr = ({ url, body = null, method = 'get' }) => {
  const defer = $.Deferred()

  $.ajax({
    type: method,
    url: rootPath + url,
    data: body
    // xhrFields: { // 跨域允许带上 cookie
    //   withCredentials: [域名]
    // },
    // crossDomain: true
  })
  .done((result) => {
    if (!result) {
      console.error('no result')
    } else if (result.Code !== 0) {
      console.error(result.Msg)
    } else {
      defer.resolve(result.Data)
    }
  })
  .fail((e) => {
    console.error(e)
    defer.reject(e)
  })

  return defer.promise()
}

export default xhr
